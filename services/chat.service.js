import createHttpError from "http-errors";
import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";

export const checkChatExist = async (sender_id, receiver_id) => {
  const chat = await ChatModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  }).populate("users", "-password");

  await ChatModel.populate(chat, {
    path: "latestMessage",
    populate: {
      path: "sender",
      select: "-password",
    },
  });

  if (!chat) {
    throw createHttpError("Oops something went wrong");
  }

  return chat[0];
};

export const chatCleaner = async (chatId, loggedInUser) => {
  const chat = await ChatModel.findById(chatId)
    .populate({
      path: "users",
      select: "-password",
    })
    .populate({ path: "admin", select: "-passowrd" });

  if (chat.latestMessage) {
    await ChatModel.populate(chat, { path: "latestMessage" });
  }

  const otherUser = chat.users.find(
    (user) => user._id.toString() !== loggedInUser.toString()
  );

  const cleanedChat = {
    _id: chat._id,
    isGroup: chat.isGroup,
    name: otherUser.name,
    picture: otherUser.picture,
    users: chat.users,
    admin: chat.admin || null,
    latestMessage: chat.latestMessage || null,
    createdAt: chat.createdAt,
  };

  return cleanedChat;
};

export const findChats = async (userId) => {
  console.log("hello 2222");
  // 1. Get all chats for this user
  const chats = await ChatModel.find({
    users: { $elemMatch: { $eq: userId } },
  })
    .populate({ path: "users", select: "-password" })
    .populate({ path: "latestMessage" })
    .sort({ updatedAt: -1 })
    .lean();

  console.log("hello unreadCounts");

  // 2. Aggregate unread counts for all these chats in one query
  let unreadCounts = [];
  try {
    unreadCounts = await MessageModel.aggregate([
      {
        $match: {
          chat: { $in: chats.map((c) => c._id) },
          readBy: { $nin: [userId] },
        },
      },
      {
        $group: {
          _id: "$chat",
          unreadCount: { $sum: 1 },
        },
      },
    ]);
    console.log("hello unreadCounts", unreadCounts);
  } catch (err) {
    console.error("aggregate error:", err);
  }

  console.log("hello unreadCounts 222222");

  // 3. Convert aggregation result into a lookup object
  const unreadMap = unreadCounts.reduce((acc, item) => {
    acc[item._id.toString()] = item.unreadCount;
    return acc;
  }, {});

  // 4. Merge unreadCount into chat objects
  return chats.map((chat) => ({
    ...chat,
    unreadCount: unreadMap[chat._id.toString()] || 0,
  }));
};

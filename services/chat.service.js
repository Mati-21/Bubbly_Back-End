import createHttpError from "http-errors";
import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import mongoose from "mongoose";

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
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Get all chats for this user
    const chats = await ChatModel.find({
      users: userObjectId, // simpler than $elemMatch
    })
      .populate({ path: "users", select: "-password" })
      .populate({ path: "latestMessage" })
      .sort({ updatedAt: -1 })
      .lean();

    if (!chats.length) return [];

    // 2. Aggregate unread counts
    const unreadCounts = await MessageModel.aggregate([
      {
        $match: {
          chat: { $in: chats.map((c) => c._id) },
          readby: { $nin: [userObjectId] },
        },
      },
      {
        $group: {
          _id: "$chat",
          unreadCount: { $sum: 1 },
        },
      },
    ]);

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
  } catch (err) {
    console.error("findChats error:", err);
    return [];
  }
};

export const updateChatMessages = async (userId, chatId) => {
  // Update all unread messages
  await MessageModel.updateMany(
    { chat: chatId, readby: { $nin: [userId] } },
    { $addToSet: { readby: userId } }
  );

  // Fetch updated docs
  const updatedMessages = await MessageModel.find({ chat: chatId });

  return updatedMessages;
};

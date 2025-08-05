import createHttpError from "http-errors";
import ChatModel from "../models/chat.model.js";

export const checkChatExist = async (sender_id, receiver_id) => {
  console.log("receiver", receiver_id);
  console.log("sender", sender_id);

  const chat = await ChatModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  }).populate("users", "-password");

  console.log("ssss", chat);
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
  const chats = await ChatModel.find({
    users: { $elemMatch: { $eq: userId } },
  })
    .populate({ path: "users", select: "-password" })
    .populate({ path: "latestMessage" })
    .sort({ updatedAt: -1 });

  return chats;
};

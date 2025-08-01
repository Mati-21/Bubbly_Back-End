import createHttpError from "http-errors";
import ChatModel from "../models/chat.model.js";

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

export const populateChat = async (chatId) => {
  let populatedChat = await ChatModel.findById(chatId).populate(
    "users",
    "-password"
  );
  console.log("inner", populatedChat);
  return populateChat;
};

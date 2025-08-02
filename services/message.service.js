import MessageModel from "../models/message.model.js";
import createHttpError from "http-errors";
import ChatModel from "../models/chat.model.js";

export const createMessage = async (msgData) => {
  const newMessage = await MessageModel.create(msgData);

  if (!newMessage) {
    throw createHttpError.BadRequest("Oops Something went wrong");
  }

  return newMessage;
};

export const populateMessage = async (MessageId) => {
  const populatedMessage = await MessageModel.findById(MessageId)
    .populate({
      path: "sender",
      select: "name email picture bio",
    })
    .populate({
      path: "chat",
      populate: { path: "users", select: "-password" },
    });

  if (!populatedMessage) {
    throw createHttpError.BadRequest("Oops Something went wrong");
  }

  return populatedMessage;
};

export const updateLatestMessageInChat = async (chat_id, msg) => {
  const updatedChat = await ChatModel.findByIdAndUpdate(
    chat_id,
    {
      latestMessage: msg,
    },
    { new: true }
  );
  console.log("updated Chat", updatedChat);
  return updatedChat;
};

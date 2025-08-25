import createHttpError from "http-errors";
import UserModel from "../models/user.model.js";
import ChatModel from "../models/chat.model.js";
import {
  chatCleaner,
  checkChatExist,
  findChats,
} from "../services/chat.service.js";

export const create_open_chat = async (req, res, next) => {
  try {
    const { receiver_id } = req.body;
    const sender_id = req.userId;
    console.log(receiver_id);
    console.log(sender_id);

    if (!receiver_id) {
      throw createHttpError("Oops something went wrong");
    }

    const chatExist = await checkChatExist(sender_id, receiver_id);

    if (chatExist) {
      const cleanedChat = await chatCleaner(chatExist._id, sender_id);
      res.status(200).json(cleanedChat);
    } else {
      const user = await UserModel.findById(receiver_id);

      let newChatData = {
        name: user.name,
        picture: user.picture,
        isGroup: false,
        users: [sender_id, receiver_id],
        admin: null,
        latestMessage: null,
      };

      const newChat = await ChatModel.create(newChatData);

      const populatedChat = await chatCleaner(newChat._id, sender_id);

      res.status(200).json(populatedChat);
    }
  } catch (error) {
    console.log("%00 error");
    next(error);
  }
};

export const getChats = async (req, res, next) => {
  try {
    console.log("hello");
    const userId = req.userId;
    const chats = await findChats(userId);

    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

// controllers/chatController.js
export const markMessagesAsRead = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  await MessageModel.updateMany(
    { chat: chatId, readBy: { $nin: [userId] } },
    { $push: { readBy: userId } }
  );

  res.json({ success: true });
};

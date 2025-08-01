import createHttpError from "http-errors";
import UserModel from "../models/user.model.js";
import ChatModel from "../models/chat.model.js";
import { checkChatExist, populateChat } from "../services/chat.service.js";

export const create_open_chat = async (req, res, next) => {
  try {
    const { receiver_id } = req.body;
    const sender_id = req.userId;

    if (!receiver_id) {
      throw createHttpError("Oops something went wrong");
    }

    const chatExist = await checkChatExist(sender_id, receiver_id);

    if (chatExist) {
      res.status(200).json(chatExist);
    } else {
      const user = await UserModel.findById(receiver_id);

      let newChatData = {
        name: user.name,
        isGroup: false,
        users: [sender_id, receiver_id],
      };

      const newChat = await ChatModel.create(newChatData);
      const populatedChat = await populateChat(newChat._id);
      console.log("outer", populatedChat);
      res.status(200).json(populatedChat);
    }
  } catch (error) {
    next(error);
  }
};

import createHttpError from "http-errors";
import {
  createMessage,
  populateMessage,
  updateLatestMessageInChat,
} from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { message, chat_id, files } = req.body;
    const sender_id = req.userId;

    if (!chat_id || (!message && !files)) {
      throw createHttpError.BadRequest("Oops something went wrong");
    }

    const msgData = {
      sender: sender_id,
      message,
      files: files || [],
      chat: chat_id,
    };

    const newMessage = await createMessage(msgData);

    const populatedMessage = await populateMessage(newMessage._id);

    await updateLatestMessageInChat(chat_id, newMessage);

    res.status(200).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

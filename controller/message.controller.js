import createHttpError from "http-errors";
import {
  createMessage,
  getChatMessages,
  populateMessage,
  updateLatestMessageInChat,
} from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { message, chat_id, files } = req.body;
    const sender_id = req.userId;

    if (!chat_id || (!message && !files.length > 0)) {
      throw createHttpError.BadRequest("Oops something went wrong");
    }

    const msgData = {
      sender: sender_id,
      message,
      files: files || [],
      chat: chat_id,
      readby: [sender_id],
    };

    const newMessage = await createMessage(msgData);

    const populatedMessage = await populateMessage(newMessage._id);

    await updateLatestMessageInChat(chat_id, newMessage);

    res.status(200).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const chat_id = req.params.chat_id;

    const messages = await getChatMessages(chat_id);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

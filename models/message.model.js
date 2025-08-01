import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = mongoose.model(
  {
    sender: {
      type: ObjectId,
      ref: "UserModel",
    },
    message: {
      type: String,
      trim: true,
    },
    files: [],
    chat: {
      type: ObjectId,
      ref: "ChatModel",
    },
  },
  {
    collection: "messages",
    timestamp: true,
  }
);

const MessageModel =
  mongoose.models.MessageModel || mongoose.model("MessageModel", messageSchema);
export default MessageModel;

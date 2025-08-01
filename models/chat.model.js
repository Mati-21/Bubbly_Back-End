import mongoose from "mongoose";
const { Types } = mongoose;
const { ObjectId } = Types;

const chatSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    picture: String,
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: "MessageModel",
    },
    admin: {
      type: ObjectId,
      ref: "UserModel",
    },
  },
  {
    collection: "Chats",
    timestamps: true,
  }
);

const ChatModel =
  mongoose.models.ChatModel || mongoose.model("ChatModel", chatSchema);
export default ChatModel;

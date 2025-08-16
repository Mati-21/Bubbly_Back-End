import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be provided"],
      minLength: [2, "Name should be longer than 2 characters long"],
      maxLength: [20, "Name should not be longer than 20 characters long"],
      match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: [true, "This email already exists"],
      validate: [validator.isEmail, "Please provide a valid email address"],
      lowercase: true,
    },

    password: {
      type: String,
      min: [6, "Minimum Length for password is 6 characters"],
      max: [128, "Maximum Length for password is 128 characters"],
    },

    picture: {
      type: [String], // ✅ array of image URLs
      default: [],
    },

    bio: {
      type: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const UserModel =
  mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export default UserModel;

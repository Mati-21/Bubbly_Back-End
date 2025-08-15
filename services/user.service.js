import UserModel from "../models/user.model.js";

export const findUser = async (userId) => {
  const user = await UserModel.findById(userId).select("-password");

  return user;
};

export const getUsers = async (query) => {
  const users = await UserModel.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  }).select("-password");

  return users;
};

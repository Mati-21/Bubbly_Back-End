import UserModel from "../models/user.model.js";

export const findUser = async (userId) => {
  console.log("gggggggg", userId);
  const user = await UserModel.findById(userId).select("-password");

  return user;
};

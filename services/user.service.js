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

export const updateProfile = async (userId, profileUrl) => {
  try {
    const user = await UserModel.findById(userId);

    if (!user) throw new Error("User not found");

    // Make sure picture is always an array
    if (!Array.isArray(user.picture)) {
      user.picture = [];
    }

    user.picture.unshift(profileUrl); // add new pic at beginning

    const updatedUser = await user.save();
    // persist to DB

    return updatedUser;
  } catch (err) {
    console.error("Update profile error:", err.message);
    throw err;
  }
};

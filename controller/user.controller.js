import { findUser, getUsers } from "../services/user.service.js";

export const getUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await findUser(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const searchUser = async (req, res, next) => {
  try {
    const { value } = req.body;
    console.log(value);

    const users = await getUsers(value);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

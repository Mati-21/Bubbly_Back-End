import { findUser } from "../services/user.service.js";

export const getUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await findUser(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

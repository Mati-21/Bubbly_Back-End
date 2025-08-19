import { checkToken } from "../services/token.service.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.Access_token;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = await checkToken(token, process.env.TOKEN_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

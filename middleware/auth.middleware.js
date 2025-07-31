import { checkToken } from "../services/token.service.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.Access_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    console.log(process.env.Access_token);

    const decoded = await checkToken(token, process.env.TOKEN_SECRET);

    res.status(200).json(decoded);
  } catch (error) {
    next(error);
  }
};

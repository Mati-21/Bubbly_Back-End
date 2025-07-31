import { createUser, signinUser } from "../services/auth.service.js";
import { createToken } from "../services/token.service.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, picture, bio } = req.body;
    const newUser = await createUser({ name, email, password, picture, bio });

    const token = await createToken(
      { userId: newUser._id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "5m", // or '60s', or 60
      }
    );

    res.cookie("Access_token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 5,
    });

    res.status(200).json({
      message: "User Created Successfully",
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
      bio: newUser.bio,
    });
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signinUser({ email, password });

    const token = await createToken(
      { userId: user._id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1m",
      }
    );

    res.cookie("Access_token", token, { maxAge: 1000 * 60 });

    res.status(200).json({
      message: "User Login Successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      bio: user.bio,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("Access_token", { httpOnly: true, sameSite: "strict" });
    res.status(200).json({
      message: "Logged out Successfully",
    });
  } catch (error) {
    next(error);
  }
};

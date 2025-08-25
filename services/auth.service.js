import createHttpError from "http-errors";
import validator from "validator";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const createUser = async ({ name, email, password, picture, bio }) => {
  const { DEFAULT_BIO, DEFAULT_PICTURE } = process.env;

  // check if the required fields have a value
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all required fields");
  }

  // check if name has some special characters in them
  if (!/^[a-zA-Z\s-]+$/.test(name)) {
    throw createHttpError.BadRequest(
      "Name should not contain a special charcters"
    );
  }

  // check character length for name fields
  if (!validator.isLength(name, { min: 2, max: 20 })) {
    throw createHttpError.BadRequest(
      "Name should have between 2 and 20 characters long"
    );
  }

  // check if the email exist
  const isUserEXist = await UserModel.findOne({ email });
  if (isUserEXist) {
    throw createHttpError.Conflict("This email already exist !!");
  }

  // check if its a valid eamil
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Please provide a valid email address");
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  try {
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      picture: [picture || DEFAULT_PICTURE],
      bio: bio || DEFAULT_BIO,
    });

    return newUser;
  } catch (error) {
    throw createHttpError.BadRequest(error.message);
  }
};

export const signinUser = async ({ email, password }) => {
  // check if the user exist
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError.NotFound("Incorrect credentials");
  }

  // check password
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    throw createHttpError.NotFound("Incorrect credentials");
  }

  return user;
};

import { StatusCodes } from "http-status-codes";

import { User } from "../models/user.model.js";
import { matchedData } from "express-validator";

export const signUp = async (req) => {
  const { email, username, password } = matchedData(req);

  const savedUser = await User.signUp(email, username, password);

  return {
    statusCode: StatusCodes.CREATED,
    message: "User registered successfully",
    data: savedUser,
  };
};

export const login = async (req) => {
  const { email, password } = matchedData(req);

  const { user, accessToken, refreshToken } = await User.login(email, password);

  return {
    statusCode: StatusCodes.OK,
    message: "User logged in successfully",
    data: {
      user,
      accessToken,
    },
    cookies: {
      refreshToken,
    },
  };
};

export default { signUp, login };

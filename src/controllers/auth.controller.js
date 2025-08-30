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

export default { signUp };

import crypto from "crypto";

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { sendEmail } from "../utils/email.js";
import { emailVerificationTemplate } from "../templates/email.js";
import { StatusCodes } from "http-status-codes";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: {
        url: {
          type: String,
          required: [true, "Avatar URL is required"],
        },
        localPath: {
          type: String,
        },
      },
      default: {
        url: "https://placehold.co/200",
        localPath: "",
      },
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
      select: false,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

userSchema.methods.generateRefreshToken = function () {
  const token = crypto.randomBytes(40).toString("hex");
  const hash = crypto
    .createHmac("sha256", env.REFRESH_TOKEN_SECRET)
    .update(token)
    .digest("hex");
  this.refreshToken = hash;

  return token;
};

userSchema.methods.generateTemporaryToken = function () {
  const token = crypto.randomBytes(40).toString("hex");
  const hash = crypto
    .createHmac("sha256", env.TEMPORARY_TOKEN_SECRET)
    .update(token)
    .digest("hex");

  const tokenExpiry = Date.now() + 10 * 60 * 1000;

  return { token, hash, tokenExpiry };
};

userSchema.statics.signUp = async function (email, username, password) {
  const existingUser = await this.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(
      "Email or username already exists",
      StatusCodes.CONFLICT,
    );
  }

  const newUser = new this({
    email,
    username,
    password,
  });

  const { token, hash, tokenExpiry } = newUser.generateTemporaryToken();
  newUser.emailVerificationToken = hash;
  newUser.emailVerificationExpiry = tokenExpiry;

  const savedUser = await newUser.save();
  if (!savedUser) {
    throw new ApiError(
      "User registration failed",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  await sendEmail(
    savedUser.email,
    "Verify your email",
    emailVerificationTemplate(savedUser.username, token),
  );

  return await User.findById(savedUser._id);
};

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  const isMatch = await user?.comparePassword(password);

  if (!user || !isMatch) {
    throw new ApiError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const savedUser = await user.save();
  if (!savedUser) {
    throw new ApiError("User login failed", StatusCodes.INTERNAL_SERVER_ERROR);
  }

  return {
    user: await User.findById(savedUser._id),
    accessToken,
    refreshToken,
  };
};

export const User = mongoose.model("User", userSchema);

export default User;

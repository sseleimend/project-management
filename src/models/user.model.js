import crypto from "crypto";

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

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
          required: [true, "Avatar local path is required"],
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
  const secret = env.REFRESH_TOKEN_SECRET;
  const token = crypto.randomBytes(40).toString("hex");
  const hash = crypto.createHmac("sha256", secret).update(token).digest("hex");
  this.refreshToken = hash;

  return token;
};

userSchema.methods.generateTemporaryToken = function () {
  const token = crypto.randomBytes(40).toString("hex");
  const hash = crypto.createHmac("sha256").update(token).digest("hex");

  const tokenExpiry = Date.now() + 10 * 60 * 1000;

  return { token, hash, tokenExpiry };
};

export const User = mongoose.model("User", userSchema);

export default User;

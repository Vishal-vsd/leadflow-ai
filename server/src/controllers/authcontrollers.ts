import { Request, Response } from "express";
import ApiError from "../utils/apiError";
import User from "../models/User";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      throw new ApiError(500, "Failed to create user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  },
);


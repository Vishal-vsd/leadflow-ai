import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtPayload {
  _id: string;
  email: string;
  role: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

  const user = await User.findById(decoded._id);

  if (!user) {
    throw new ApiError(401, "Invalid token");
  }

  (req as any).user = user;

  next();
};

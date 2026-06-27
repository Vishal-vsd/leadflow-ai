import { NextFunction, Request, Response } from "express";
import ApiError from "./apiError";

const errorMiddleware = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;

  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;

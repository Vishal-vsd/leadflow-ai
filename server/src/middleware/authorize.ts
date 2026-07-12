import { NextFunction, Request, Response } from "express"
import ApiError from "../utils/apiError"

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user._id;

        if (!user) {
            throw new ApiError(
                401,
                "Unauthorized"
            )
        }

        if (!roles.includes(user.role)) {
            throw new ApiError(
                403,
                "Forbidden"
            )
        }

        next()
    }
}
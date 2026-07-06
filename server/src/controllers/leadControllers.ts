import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import Lead from "../models/Lead";

export const createLead = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, email, phone, title, company, source, notes } = req.body;

        if (!name || !email) {
            throw new ApiError(400, "Name and Email are required")
        }

        const userId = (req as any).user._id

        const existingLead = await Lead.findOne({ email, assignedTo: userId});

        if (existingLead) {
            throw new ApiError(409, "Lead already exists")
        }
        
        const lead = await Lead.create(
            {
                title,
                name,
                email,
                phone,
                company,
                source,
                notes,
                assignedTo: userId,
            }
        )

        return res.status(201).json(
            new ApiResponse(
                201,
                lead,
                "Lead created successfully"
            )
        );
    }
)
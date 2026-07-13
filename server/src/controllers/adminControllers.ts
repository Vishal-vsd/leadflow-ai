import Lead from "../models/Lead";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";

export const getAllLeads = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) | 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await Lead.aggregate([
            {
                $facet: {
                    leads: [
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        }
                    ],
                    totalCount: [
                        {
                            $count: "count"
                        }
                    ]
                }
            }
        ])

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "All leads fetched successfully"
            )
        )
    }
)
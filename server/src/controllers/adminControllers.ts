import mongoose from "mongoose";
import Lead from "../models/Lead";
import User from "../models/User";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import ApiError from "../utils/apiError";

export const getAllLeads = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = req.query.search as string;
        const status = req.query.status as string;
        const source = req.query.source as string;
        const sort = req.query.sort as string;

        const skip = (page - 1) * limit;

        const matchQuery: any = {}

        if (status) {
            matchQuery.status = status
        }
        if (source) {
            matchQuery.source = source;
        }

        if (search) {
            matchQuery.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    company: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        }

        let sortOption: any = {
            createdAt: -1
        }

        if (sort === "oldest") {
            sortOption = {
                createdAt: 1
            }
        }

        const result = await Lead.aggregate([
            {
                $match: matchQuery
            },
            {
                $facet: {
                    leads: [
                        {
                            $sort: sortOption
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

        const leads = result[0].leads;
        const totalLeads = result[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(
            totalLeads / limit
        )

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    leads,
                    pagination: {
                        page,
                        limit,
                        totalLeads,
                        totalPages
                    }
                },
                "All leads fetched successfully"
            )
        )
    }
)

export const getAllLeadStats = asyncHandler(
    async (req: Request, res: Response) => {
        const [stats, totalUsers] = await Promise.all([Lead.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]),
        User.countDocuments()
        ])

        let allLeadStats = {
            totalUsers,
            totalLeads: 0,
            newLeads: 0,
            contactedLeads: 0,
            qualifiedLeads: 0,
            proposalLeads: 0,
            wonLeads: 0,
            lostLeads: 0
        }

        stats.forEach((item) => {
            allLeadStats.totalLeads += item.count;

            switch (item._id) {
                case "new": allLeadStats.newLeads = item.count;
                    break;

                case "contacted": allLeadStats.contactedLeads = item.count;
                    break;

                case "qualified": allLeadStats.qualifiedLeads = item.count;
                    break;

                case "proposal": allLeadStats.proposalLeads = item.count;
                    break;

                case "won": allLeadStats.wonLeads = item.count;
                    break;

                case "lost": allLeadStats.lostLeads = item.count;
                    break;
            }
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                allLeadStats,
                "All leads stats fetched successfully"
            )
        )
    }
)

export const getAllSourceStats = asyncHandler(
    async (req: Request, res: Response) => {
        const stats = await Lead.aggregate([
            {
                $group: {
                    _id: "$source",
                    count: {
                        $sum: 1
                    }
                }
            }
        ])

        let allSourceStats = {
            website: 0,
            linkedin: 0,
            referral: 0,
            facebook: 0,
            instagram: 0,
            other: 0
        }

        stats.forEach((item) => {
            if (item._id) {
                allSourceStats[
                    item._id as keyof typeof allSourceStats
                ] = item.count
            }
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                allSourceStats,
                "Global source stats fetched successfully!"
            )
        )
    }
)

export const getAllConversionStats = asyncHandler(
    async (req: Request, res: Response) => {
        const stats = await Lead.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            }
        ])

        let totalLeads = 0
        let wonLeads = 0
        let lostLeads = 0

        stats.forEach((item) => {
            totalLeads += item.count

            if (item._id === "won") {
                wonLeads = item.count
            }
            if (item._id === "lost") {
                lostLeads = item.count
            }
        })

        const conversionRate = totalLeads === 0 ? 0
            : Number(((wonLeads / totalLeads) * 100).toFixed(2))

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    totalLeads,
                    wonLeads,
                    lostLeads,
                    conversionRate
                },
                "Global Conversion stats fetched successfully"
            )
        )
    }
)

export const getAllUsers = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string;
        const sort = req.query.sort as string;

        const skip = (page - 1) * limit;


        const matchQuery: any = {};

        let sortOption: any = {
            createdAt: -1
        }

        if (search) {
            matchQuery.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    }
                },
            ]
        }

        if (sort === "oldest") {
            sortOption = { createdAt: 1 }
        }

        const result = await User.aggregate([
            {
                $match: matchQuery
            },
            {
                $facet: {
                    users: [
                        {
                            $sort: sortOption
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                        {
                            $project: {
                                password: 0,
                                refreshToken: 0
                            }
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

        const users = result[0].users;

        const totalUsers = result[0].totalCount[0]?.count || 0;

        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    users,
                    totalUsers,
                    currentPage: page,
                    totalPages
                },
                "Users fetched successfully"
            )
        )
    }
)

export const updateUserRole = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { role } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            throw new ApiError(
                400, "Invalid User ID"
            )
        }

        if (!["admin", "user"].includes(role)) {
            throw new ApiError(400, "Invalid role")
        }

        const adminId = (req as any).user._id;

        if (adminId.toString() === id && role === "user") {
            throw new ApiError(400, "You cannot change  your own role")
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                role
            },
            {
                new: true,
                runValidators: true,
                select: "-password -refreshToken"
            }
        );

        if (!updatedUser) {
            throw new ApiError(
                404,
                "User not found"
            )
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedUser,
                "User role updated successfully"
            )
        )
    }
)

export const getDashboardData = asyncHandler(
    async (req, res) => {
        const [totalUsers, leadStats, sourceStats, conversionStats] =
            await Promise.all([
                User.countDocuments(),

                Lead.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ]),

                Lead.aggregate([
                    {
                        $group: {
                            _id: "$source",
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ]),

                Lead.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ])
            ])
    }
)
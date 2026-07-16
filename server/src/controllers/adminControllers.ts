import Lead from "../models/Lead";
import User from "../models/User";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";

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

export const getAllLeadsStats = asyncHandler(
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

        const allLeadStats = {
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
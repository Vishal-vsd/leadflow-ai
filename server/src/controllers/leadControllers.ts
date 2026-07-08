import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import Lead from "../models/Lead";
import mongoose from "mongoose";

export const createLead = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, email, phone, title, company, source, notes } = req.body;

        if (!name || !email) {
            throw new ApiError(400, "Name and Email are required")
        }

        const userId = (req as any).user._id

        const existingLead = await Lead.findOne({ email, assignedTo: userId });

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

export const getLeads = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = (req as any).user._id;

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filters
        const status = req.query.status as string;
        const search = req.query.search as string;
        const sort = req.query.sort as string;

        // Base Query
        const query: any = {
            assignedTo: userId,
        };

        // Status Filter
        if (status) {
            query.status = status;
        }

        // Search
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    company: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // Sorting
        let sortOption: any = {
            createdAt: -1,
        };

        if (sort === "oldest") {
            sortOption = {
                createdAt: 1,
            };
        }

        if (sort === "latest") {
            sortOption = {
                createdAt: -1,
            };
        }

        // const leads = await Lead.find(query)
        // const totalLeads = await Lead.countDocuments(query)

        // optimized code by using aggregation and $facet to use one pipeline to fetch both leads and totalLeads
        
        const result = await Lead.aggregate([
            {
                $match: query
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

        const totalLeads = result[0].totalCount[0]?.count || 0

        const totalPages = Math.ceil(
            totalLeads / limit
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    leads,
                    pagination: {
                        page,
                        limit,
                        totalLeads,
                        totalPages,
                    },
                },
                "Leads fetched successfully!"
            )
        );
    }
);
export const getLeadById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            throw new ApiError(400, "Invalid lead id");
        }

        const userId = (req as any).user._id;

        const lead = await Lead.findOne({
            _id: id,
            assignedTo: userId
        })

        if (!lead) {
            throw new ApiError(404, "Lead not found")
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                lead,
                "Lead fetched successfully"
            )
        )
    }
)

export const updateLead = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {

            throw new ApiError(400, "Invalid lead id");

        }

        const userId = (req as any).user._id

        const allowedFields = [
            "title", "email", "name", "phone", "company", "status", "source", "notes"
        ]

        const updates: Record<string, any> = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });
        const updatedLead = await Lead.findOneAndUpdate(
            {
                _id: id,
                assignedTo: userId
            },
            {
                $set: updates,
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updateLead) {
            throw new ApiError(404, "Lead not found")
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedLead,
                "Lead updated successfully"
            )
        )
    }
)

export const deleteLead = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            throw new ApiError(400, "Invalid lead ID")
        }
        const userId = (req as any).user._id;

        const deletedLead = await Lead.findOneAndDelete({
            _id: id,
            assignedTo: userId
        })

        if (!deletedLead) {
            throw new ApiError(404, "Lead not found")
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Lead deleted successfully!"
            )
        )
    }
)

export const getLeadStats = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = (req as any).user._id

        // const totalLeads = await Lead.countDocuments({
        //     assignedTo: userId
        // })

        // const newLeads = await Lead.countDocuments({
        //     assignedTo: userId,
        //     status: "new"
        // })

        // const contactedLeads = await Lead.countDocuments({
        //     assignedTo: userId,
        //     status: "contacted"
        // })
        // const qualifiedLeads = await Lead.countDocuments({
        //     assignedTo: userId,
        //     status: "qualified"
        // })

        // const proposalLeads = await Lead.countDocuments({
        //     assignedTo: userId,
        //     status: "proposal"
        // })

        // const wonLeads = await Lead.countDocuments({
        //     assignedTo: userId,
        //     status: "won"
        // })

        // const lostLeads = await Lead.countDocuments({
        //     assignedTo: userId,
        //     status: "lost"
        // })

        // using aggregation pipeline

        const stats = await Lead.aggregate([
            {
                $match: {
                    assignedTo: userId
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            }
        ])

        const leadStats = {
            totalLeads: 0,
            newLeads: 0,
            contactedLeads: 0,
            qualifiedLeads: 0,
            proposalLeads: 0,
            wonLeads: 0,
            lostLeads: 0
        }

        stats.forEach((item) => {
            leadStats.totalLeads += item.count;

            switch (item._id) {
                case "new": leadStats.newLeads = item.count;
                    break;

                case "contacted": leadStats.contactedLeads = item.count;
                    break;

                case "qualified": leadStats.qualifiedLeads = item.count;
                    break;

                case "proposal": leadStats.proposalLeads = item.count;
                    break;

                case "won": leadStats.wonLeads = item.count;
                    break;

                case "lost": leadStats.lostLeads = item.count;
                    break;
            }
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                leadStats,
                "Lead stats fetched successfully!"
            )
        )
    }
)
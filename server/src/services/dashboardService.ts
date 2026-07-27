import User from "../models/User";
import { getLeadStats, getSourceStats, getConversionStats } from "./anaylticsService";

export const getDashoboardStats = async() => {
    const [totalUsers, leadStats, sourceStats, conversionStats] = await Promise.all([
        User.countDocuments(),
        getLeadStats(),
        getSourceStats(),
        getConversionStats()
    ])

    return {
        totalUsers,
        leadStats,
        sourceStats,
        conversionStats
    }
}
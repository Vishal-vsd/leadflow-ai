import Lead from "../models/Lead";

export const getLeadStats = async () => {
    const stats = await Lead.aggregate([
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        }
    ]);

    let leadStats = {
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        proposalLeads: 0,
        wonLeads: 0,
        lostLeads: 0
    };

    stats.forEach((item) => {
        leadStats.totalLeads += item.count;

        switch (item._id) {
            case "new":
                leadStats.newLeads = item.count;
                break;

            case "contacted":
                leadStats.contactedLeads = item.count;
                break;

            case "qualified":
                leadStats.qualifiedLeads = item.count;
                break;

            case "proposal":
                leadStats.proposalLeads = item.count;
                break;

            case "won":
                leadStats.wonLeads = item.count;
                break;

            case "lost":
                leadStats.lostLeads = item.count;
                break;
        }
    });

    return leadStats;
};
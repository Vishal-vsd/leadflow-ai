import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "proposal", "won", "lost"],
      default: "new",
    },
    source: {
      type: String,
      enum: [
        "website",
        "facebook",
        "instagram",
        "linkedin",
        "other",
        "referral",
      ],
    },

    score: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    notes: {
      type: String,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    aiSummary: {
        type: String
    }
  },
  { timestamps: true },
);


const Lead = mongoose.model("Lead", leadSchema)

export default Lead;
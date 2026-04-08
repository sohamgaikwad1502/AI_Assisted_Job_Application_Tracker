import { Document, Schema, model, Types } from "mongoose";

export type AppStatus =
  | "Applied"
  | "Phone Screen"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface ApplicationDoc extends Document {
  userId: Types.ObjectId;
  company: string;
  role: string;
  jdLink?: string;
  notes?: string;
  dateApplied?: string;
  status: AppStatus;
  salaryRange?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
  aiSuggestions?: string[];
}

const applicationSchema = new Schema<ApplicationDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    jdLink: { type: String },
    notes: { type: String },
    dateApplied: { type: String },
    status: { type: String, required: true },
    salaryRange: { type: String },
    requiredSkills: [{ type: String }],
    niceToHaveSkills: [{ type: String }],
    seniority: { type: String },
    location: { type: String },
    aiSuggestions: [{ type: String }]
  },
  { timestamps: true }
);

export const Application = model<ApplicationDoc>(
  "Application",
  applicationSchema
);

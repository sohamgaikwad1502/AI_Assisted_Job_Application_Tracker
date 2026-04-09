export type AppStatus =
  | "Applied"
  | "Phone Screen"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface Application {
  _id: string;
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

export interface ParseResult {
  parsed: {
    company: string;
    role: string;
    requiredSkills: string[];
    niceToHaveSkills: string[];
    seniority: string;
    location: string;
  };
  suggestions: string[];
}

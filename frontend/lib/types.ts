export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  location?: string;
}

export interface CustomColors {
  primaryColor: string;
  bgColor: string;
}

export interface PortfolioSettings {
  template?: string;
  custom_colors?: CustomColors;
  section_order?: string[];
  dark_mode?: boolean;
  available_for_hire?: boolean;
  slug?: string;
}

export interface Experience {
  company: string;
  title: string;
  start_date: string;
  end_date?: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  graduation_year?: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface ParsedResume {
  name?: string;
  contact: ContactInfo;
  summary?: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: string[];
}

export interface PortfolioResponse {
  id: string;
  parsed_data: ParsedResume;
  ats_score: number;
  ats_feedback: string[];
  template: string;
  created_at: string;
  photo_url?: string;
  custom_colors?: CustomColors;
  section_order?: string[];
  dark_mode?: boolean;
  available_for_hire?: boolean;
  slug?: string;
  view_count?: number;
}

export interface TailorResult {
  tailored_summary: string;
  highlighted_skills: string[];
  skill_match_notes: string;
}

export interface SuggestionResult {
  issues: string[];
  improvements: string[];
  positives: string[];
  overall_score: number;
}

export interface RankedResumeItem {
  id: string;
  filename: string;
  score: number;
  feedback: string[];
}

export interface RankingJobResponse {
  id: string;
  job_description: string;
  created_at: string;
  results: RankedResumeItem[];
}

export type Role = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  website?: string | null;
  industry?: string | null;
  size?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  isVerified: boolean;
}

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string | null;
  location?: string | null;
  isRemote: boolean;
  type: JobType;
  status: JobStatus;
  minSalary?: number | null;
  maxSalary?: number | null;
  currency?: string | null;
  skills: string[];
  applicationDeadline?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  company?: Company;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface Application {
  id: string;
  jobId: string;
  jobSeekerProfileId: string;
  status: ApplicationStatus;
  coverLetter?: string | null;
  recruiterNotes?: string | null;
  appliedAt: string;
  job?: Job;
}

export interface Resume {
  id: string;
  fileName: string;
  fileUrl: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SavedJob {
  id: string;
  jobId: string;
  createdAt: string;
  job: Job;
}

export interface JobAlert {
  id: string;
  keyword?: string | null;
  location?: string | null;
  jobType?: JobType | null;
  createdAt: string;
}

export interface RecommendedJob extends Job {
  matchCount: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface RecruiterStats {
  totalJobs: number;
  totalApplicants: number;
  jobsByStatus: StatusCount[];
  applicationsByStatus: StatusCount[];
}

export interface AdminStats {
  totalCompanies: number;
  totalApplications: number;
  usersByRole: Array<{ role: Role; count: number }>;
  jobsByStatus: StatusCount[];
}

export type WorkPreference = 'REMOTE' | 'HYBRID' | 'ON_SITE';
export type LanguageProficiency = 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE';

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  url?: string | null;
  techStack: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  credentialUrl?: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null;
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}

export interface AdminSettings {
  nodeEnv: string;
  corsOrigin: string;
  rateLimit: { windowMs: number; max: number };
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  googleOAuthEnabled: boolean;
  appleOAuthEnabled: boolean;
}

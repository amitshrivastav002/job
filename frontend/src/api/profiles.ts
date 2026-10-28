import { apiClient } from '@/lib/apiClient';
import type {
  Achievement,
  Certification,
  Education,
  Experience,
  JobType,
  Language,
  Project,
  Resume,
  WorkPreference,
} from '@/types';

export interface JobSeekerProfile {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  headline?: string | null;
  location?: string | null;
  phone?: string | null;
  skills: string[];
  summary?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  preferredLocations: string[];
  workPreference?: WorkPreference | null;
  expectedSalary?: number | null;
  noticePeriod?: string | null;
  employmentPreferences: JobType[];
  isPublic: boolean;
  isVisibleToRecruiters: boolean;
  resumes: Resume[];
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
  completionPercentage: number;
}

export interface RecruiterProfile {
  id: string;
  fullName: string;
  title?: string | null;
  phone?: string | null;
  isVerified: boolean;
  company: { id: string; name: string; slug: string } | null;
}

type JobSeekerProfileUpdate = Partial<
  Pick<
    JobSeekerProfile,
    | 'firstName'
    | 'lastName'
    | 'headline'
    | 'location'
    | 'phone'
    | 'skills'
    | 'summary'
    | 'githubUrl'
    | 'linkedinUrl'
    | 'portfolioUrl'
    | 'preferredLocations'
    | 'workPreference'
    | 'expectedSalary'
    | 'noticePeriod'
    | 'employmentPreferences'
    | 'isPublic'
    | 'isVisibleToRecruiters'
  >
>;

export const profilesApi = {
  getJobSeekerProfile: () =>
    apiClient.get<JobSeekerProfile>('/profiles/job-seeker/me').then((r) => r.data),

  updateJobSeekerProfile: (payload: JobSeekerProfileUpdate) =>
    apiClient.patch<JobSeekerProfile>('/profiles/job-seeker/me', payload).then((r) => r.data),

  uploadJobSeekerPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<JobSeekerProfile>('/profiles/job-seeker/me/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  getRecruiterProfile: () =>
    apiClient.get<RecruiterProfile>('/profiles/recruiter/me').then((r) => r.data),

  updateRecruiterProfile: (payload: Partial<Pick<RecruiterProfile, 'fullName' | 'title' | 'phone'>>) =>
    apiClient.patch<RecruiterProfile>('/profiles/recruiter/me', payload).then((r) => r.data),
};

export type SectionKey =
  | 'experiences'
  | 'educations'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'languages';

export const profileSectionsApi = {
  list: <T>(section: SectionKey) =>
    apiClient.get<T[]>(`/profiles/job-seeker/me/sections/${section}`).then((r) => r.data),

  create: <T>(section: SectionKey, payload: Record<string, unknown>) =>
    apiClient.post<T>(`/profiles/job-seeker/me/sections/${section}`, payload).then((r) => r.data),

  update: <T>(section: SectionKey, id: string, payload: Record<string, unknown>) =>
    apiClient.patch<T>(`/profiles/job-seeker/me/sections/${section}/${id}`, payload).then((r) => r.data),

  remove: (section: SectionKey, id: string) =>
    apiClient.delete(`/profiles/job-seeker/me/sections/${section}/${id}`).then((r) => r.data),
};

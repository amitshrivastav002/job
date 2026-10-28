import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { ContestsPage } from '@/features/contests/ContestsPage';
import { CareerGuidancePage, FaqsPage } from '@/features/help/HelpPages';
import { HomePage } from '@/features/home/HomePage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { JobSearchPage } from '@/features/jobs/JobSearchPage';
import { JobDetailPage } from '@/features/jobs/JobDetailPage';
import { RecruiterJobsPage } from '@/features/jobs/RecruiterJobsPage';
import { NewJobPage } from '@/features/jobs/NewJobPage';
import { ApplicantsPage } from '@/features/applications/ApplicantsPage';
import { MyApplicationsPage } from '@/features/applications/MyApplicationsPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { NotificationsPage } from '@/features/notifications/NotificationsPage';
import { AdminUsersPage } from '@/features/admin/AdminUsersPage';
import { AdminJobsPage } from '@/features/admin/AdminJobsPage';
import { AdminCompaniesPage } from '@/features/admin/AdminCompaniesPage';
import { AdminSettingsPage } from '@/features/admin/AdminSettingsPage';
import { SavedJobsPage } from '@/features/jobs/SavedJobsPage';
import { RecommendedJobsPage } from '@/features/jobs/RecommendedJobsPage';
import { JobAlertsPage } from '@/features/jobs/JobAlertsPage';
import { RecruiterApplicantsPage } from '@/features/applications/RecruiterApplicantsPage';
import { CompanyProfilePage } from '@/features/companies/CompanyProfilePage';
import { RecruiterAnalyticsPage } from '@/features/analytics/RecruiterAnalyticsPage';
import { AdminAnalyticsPage } from '@/features/analytics/AdminAnalyticsPage';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/jobs', element: <JobSearchPage /> },
      { path: '/contests', element: <ContestsPage /> },
      { path: '/career-guidance', element: <CareerGuidancePage /> },
      { path: '/faqs', element: <FaqsPage /> },
      { path: '/jobs/:id', element: <JobDetailPage /> },
    ],
  },
  {
    element: <AppLayout allow={['JOB_SEEKER']} />,
    children: [
      { path: '/applications', element: <MyApplicationsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/saved-jobs', element: <SavedJobsPage /> },
      { path: '/recommended', element: <RecommendedJobsPage /> },
      { path: '/job-alerts', element: <JobAlertsPage /> },
    ],
  },
  {
    element: <AppLayout allow={['RECRUITER']} />,
    children: [
      { path: '/recruiter/jobs', element: <RecruiterJobsPage /> },
      { path: '/recruiter/jobs/new', element: <NewJobPage /> },
      { path: '/recruiter/jobs/:jobId/applicants', element: <ApplicantsPage /> },
      { path: '/recruiter/applicants', element: <RecruiterApplicantsPage /> },
      { path: '/recruiter/company', element: <CompanyProfilePage /> },
      { path: '/recruiter/analytics', element: <RecruiterAnalyticsPage /> },
    ],
  },
  {
    element: <AppLayout allow={['ADMIN']} />,
    children: [
      { path: '/admin/users', element: <AdminUsersPage /> },
      { path: '/admin/jobs', element: <AdminJobsPage /> },
      { path: '/admin/companies', element: <AdminCompaniesPage /> },
      { path: '/admin/analytics', element: <AdminAnalyticsPage /> },
      { path: '/admin/settings', element: <AdminSettingsPage /> },
    ],
  },
]);

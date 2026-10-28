import type { Company, Job, JobType } from '@/types';

// Sample data shown only when VITE_USE_DUMMY_DATA=true and the API has no jobs.
export const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

const companies: Company[] = [
  { id: 'c1', name: 'Nimbus Cloud Systems', slug: 'nimbus-cloud-systems', industry: 'Information Technology', size: '201-500', isVerified: true },
  { id: 'c2', name: 'Brightline Health', slug: 'brightline-health', industry: 'Healthcare', size: '51-200', isVerified: true },
  { id: 'c3', name: 'Fintrek Solutions', slug: 'fintrek-solutions', industry: 'Financial Services', size: '11-50', isVerified: false },
];

const make = (
  n: number,
  c: number,
  title: string,
  type: JobType,
  location: string,
  isRemote: boolean,
  minSalary: number,
  maxSalary: number,
  currency: string,
  skills: string[]
): Job => ({
  id: `dummy-${n}`,
  title,
  description: `${title} at ${companies[c].name}. Work with a friendly team on meaningful products.`,
  requirements: 'Relevant experience and strong communication skills.',
  location,
  isRemote,
  type,
  status: 'PUBLISHED',
  minSalary,
  maxSalary,
  currency,
  skills,
  publishedAt: new Date(Date.now() - n * 86400000).toISOString(),
  createdAt: new Date(Date.now() - n * 86400000).toISOString(),
  company: companies[c],
});

export const dummyJobs: Job[] = [
  make(1, 0, 'Senior Backend Engineer (Node.js)', 'FULL_TIME', 'Bengaluru, India', true, 2200000, 3200000, 'INR', ['Node.js', 'TypeScript', 'PostgreSQL']),
  make(2, 0, 'DevOps Engineer', 'FULL_TIME', 'Remote', true, 1800000, 2600000, 'INR', ['Kubernetes', 'Terraform', 'Docker']),
  make(3, 0, 'Frontend Engineer (React)', 'FULL_TIME', 'Bengaluru, India', true, 1600000, 2400000, 'INR', ['React', 'TypeScript', 'CSS']),
  make(4, 0, 'Software Engineering Intern', 'INTERNSHIP', 'Bengaluru, India', false, 30000, 40000, 'INR', ['JavaScript', 'Git']),
  make(5, 1, 'Product Designer', 'FULL_TIME', 'San Francisco, CA', false, 110000, 145000, 'USD', ['Figma', 'UX Research']),
  make(6, 1, 'Data Analyst', 'PART_TIME', 'Remote', true, 55000, 75000, 'USD', ['SQL', 'Tableau', 'Python']),
  make(7, 1, 'Machine Learning Engineer', 'FULL_TIME', 'Remote', true, 140000, 180000, 'USD', ['Python', 'PyTorch', 'MLOps']),
  make(8, 2, 'Fullstack Developer (React + Node)', 'CONTRACT', 'Pune, India', true, 1200000, 1800000, 'INR', ['React', 'Node.js']),
  make(9, 2, 'Marketing Manager', 'FULL_TIME', 'Pune, India', false, 1400000, 2000000, 'INR', ['SEO', 'Content Strategy']),
  make(10, 2, 'Risk & Fraud Analyst', 'FULL_TIME', 'Pune, India', false, 1000000, 1600000, 'INR', ['SQL', 'Fraud Detection']),
];

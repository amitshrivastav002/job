import { PrismaClient, JobType, JobStatus, Role, ApplicationStatus } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const SEED_PASSWORD = 'Password123!';

async function main() {
  const passwordHash = await argon2.hash(SEED_PASSWORD);

  const companies = await Promise.all(
    [
      {
        name: 'Nimbus Cloud Systems',
        slug: 'nimbus-cloud-systems',
        website: 'https://nimbuscloud.example.com',
        industry: 'Information Technology',
        size: '201-500',
        description: 'Cloud infrastructure and DevOps tooling company.',
        isVerified: true,
      },
      {
        name: 'Brightline Health',
        slug: 'brightline-health',
        website: 'https://brightlinehealth.example.com',
        industry: 'Healthcare',
        size: '51-200',
        description: 'Digital health platform connecting patients and providers.',
        isVerified: true,
      },
      {
        name: 'Fintrek Solutions',
        slug: 'fintrek-solutions',
        website: 'https://fintrek.example.com',
        industry: 'Financial Services',
        size: '11-50',
        description: 'Payments and lending infrastructure for fintech startups.',
        isVerified: false,
      },
    ].map((data) =>
      prisma.company.upsert({ where: { slug: data.slug }, create: data, update: data })
    )
  );

  const recruiterSeeds = [
    {
      email: 'priya.recruiter@nimbuscloud.example.com',
      fullName: 'Priya Sharma',
      title: 'Senior Technical Recruiter',
      phone: '+91-9876543210',
      companyId: companies[0].id,
    },
    {
      email: 'daniel.recruiter@brightlinehealth.example.com',
      fullName: 'Daniel Ortiz',
      title: 'Talent Acquisition Lead',
      phone: '+1-415-555-0182',
      companyId: companies[1].id,
    },
    {
      email: 'meera.recruiter@fintrek.example.com',
      fullName: 'Meera Nair',
      title: 'HR Manager',
      phone: '+91-9123456780',
      companyId: companies[2].id,
    },
  ];

  const recruiterProfiles = [];
  for (const seed of recruiterSeeds) {
    const user = await prisma.user.upsert({
      where: { email: seed.email },
      create: { email: seed.email, passwordHash, role: Role.RECRUITER },
      update: {},
    });

    const profile = await prisma.recruiterProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        fullName: seed.fullName,
        title: seed.title,
        phone: seed.phone,
        companyId: seed.companyId,
        isVerified: true,
      },
      update: {
        fullName: seed.fullName,
        title: seed.title,
        phone: seed.phone,
        companyId: seed.companyId,
      },
    });

    recruiterProfiles.push({ ...profile, companyId: seed.companyId });
  }

  const jobSeeds = [
    {
      companyId: companies[0].id,
      recruiterId: recruiterProfiles[0].id,
      title: 'Senior Backend Engineer (Node.js)',
      description: 'Build and scale our cloud infrastructure APIs used by thousands of DevOps teams.',
      requirements: '5+ years Node.js, strong PostgreSQL and system design skills.',
      location: 'Bengaluru, India',
      isRemote: true,
      type: JobType.FULL_TIME,
      status: JobStatus.PUBLISHED,
      minSalary: 2200000,
      maxSalary: 3200000,
      currency: 'INR',
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
      publishedAt: new Date(),
    },
    {
      companyId: companies[0].id,
      recruiterId: recruiterProfiles[0].id,
      title: 'DevOps Engineer',
      description: 'Own CI/CD pipelines and Kubernetes infrastructure for our platform.',
      requirements: '3+ years with Kubernetes, Terraform, and CI/CD tooling.',
      location: 'Remote',
      isRemote: true,
      type: JobType.FULL_TIME,
      status: JobStatus.PUBLISHED,
      minSalary: 1800000,
      maxSalary: 2600000,
      currency: 'INR',
      skills: ['Kubernetes', 'Terraform', 'Docker', 'CI/CD'],
      publishedAt: new Date(),
    },
    {
      companyId: companies[1].id,
      recruiterId: recruiterProfiles[1].id,
      title: 'Product Designer',
      description: 'Design intuitive patient-facing experiences for our telehealth platform.',
      requirements: '4+ years product design, healthcare experience a plus.',
      location: 'San Francisco, CA',
      isRemote: false,
      type: JobType.FULL_TIME,
      status: JobStatus.PUBLISHED,
      minSalary: 110000,
      maxSalary: 145000,
      currency: 'USD',
      skills: ['Figma', 'UX Research', 'Prototyping'],
      publishedAt: new Date(),
    },
    {
      companyId: companies[1].id,
      recruiterId: recruiterProfiles[1].id,
      title: 'Customer Success Intern',
      description: 'Support onboarding and success programs for healthcare provider clients.',
      requirements: 'Currently pursuing a bachelor\'s degree; strong communication skills.',
      location: 'San Francisco, CA',
      isRemote: false,
      type: JobType.INTERNSHIP,
      status: JobStatus.PUBLISHED,
      minSalary: 25,
      maxSalary: 30,
      currency: 'USD',
      skills: ['Communication', 'CRM Tools'],
      publishedAt: new Date(),
    },
    {
      companyId: companies[2].id,
      recruiterId: recruiterProfiles[2].id,
      title: 'Fullstack Developer (React + Node)',
      description: 'Build customer-facing lending dashboards and internal fintech tooling.',
      requirements: '3+ years React and Node.js, exposure to fintech a plus.',
      location: 'Pune, India',
      isRemote: true,
      type: JobType.CONTRACT,
      status: JobStatus.PUBLISHED,
      minSalary: 1200000,
      maxSalary: 1800000,
      currency: 'INR',
      skills: ['React', 'Node.js', 'REST APIs'],
      publishedAt: new Date(),
    },
    {
      companyId: companies[0].id,
      recruiterId: recruiterProfiles[0].id,
      title: 'Frontend Engineer (React)',
      description: 'Build the dashboard UI used by DevOps teams to monitor their cloud infrastructure.',
      requirements: '3+ years React and TypeScript, eye for performance and accessibility.',
      location: 'Bengaluru, India',
      isRemote: true,
      type: JobType.FULL_TIME,
      status: JobStatus.PUBLISHED,
      minSalary: 1600000,
      maxSalary: 2400000,
      currency: 'INR',
      skills: ['React', 'TypeScript', 'CSS', 'Testing'],
      publishedAt: new Date(),
    },
    {
      companyId: companies[0].id,
      recruiterId: recruiterProfiles[0].id,
      title: 'QA Automation Engineer',
      description: 'Design and maintain automated test suites for our APIs and web console.',
      requirements: '2+ years test automation with Playwright, Cypress or similar.',
      location: 'Hyderabad, India',
      isRemote: false,
      type: JobType.FULL_TIME,
      status: JobStatus.PUBLISHED,
      minSalary: 1000000,
      maxSalary: 1600000,
      currency: 'INR',
      skills: ['Playwright', 'JavaScript', 'API Testing'],
      publishedAt: new Date(),
    },
    {
      companyId: companies[1].id,
      recruiterId: recruiterProfiles[1].id,
      title: 'Data Analyst',
      description: 'Turn clinical and engagement data into insights for product and operations teams.',
      requirements: '2+ years SQL and BI tools; healthcare data experience a plus.',
      location: 'Remote',
      isRemote: true,
      type: JobType.PART_TIME,
      status: JobStatus.PUBLISHED,
      minSalary: 55000,
      maxSalary: 75000,
      currency: 'USD',
      skills: ['SQL', 'Tableau', 'Python'],
      publishedAt: new Date(),
    },
    {
      companyId: companies[2].id,
      recruiterId: recruiterProfiles[2].id,
      title: 'Marketing Manager',
      description: 'Lead demand generation and brand campaigns for our payments products.',
      requirements: '4+ years B2B marketing, ideally in fintech or SaaS.',
      location: 'Pune, India',
      isRemote: false,
      type: JobType.FULL_TIME,
      status: JobStatus.PUBLISHED,
      minSalary: 1400000,
      maxSalary: 2000000,
      currency: 'INR',
      skills: ['Content Strategy', 'SEO', 'Analytics'],
      publishedAt: new Date(),
    },
    {
      companyId: companies[2].id,
      recruiterId: recruiterProfiles[2].id,
      title: 'Compliance Analyst',
      description: 'Review lending workflows for regulatory compliance.',
      requirements: '2+ years in fintech compliance or risk analysis.',
      location: 'Pune, India',
      isRemote: false,
      type: JobType.FULL_TIME,
      status: JobStatus.DRAFT,
      minSalary: 900000,
      maxSalary: 1300000,
      currency: 'INR',
      skills: ['Compliance', 'Risk Analysis'],
    },
    ...[
      { c: 0, title: 'Site Reliability Engineer', description: 'Keep our cloud platform highly available and build observability tooling.', requirements: '3+ years SRE or infrastructure experience, strong Linux and monitoring skills.', location: 'Remote', isRemote: true, type: JobType.FULL_TIME, minSalary: 2000000, maxSalary: 3000000, currency: 'INR', skills: ['Prometheus', 'Grafana', 'Linux', 'Go'] },
      { c: 0, title: 'Engineering Manager', description: 'Lead a team of backend engineers building core platform services.', requirements: '7+ years engineering, 2+ years managing teams.', location: 'Bengaluru, India', isRemote: false, type: JobType.FULL_TIME, minSalary: 3500000, maxSalary: 5000000, currency: 'INR', skills: ['Leadership', 'System Design', 'Hiring'] },
      { c: 0, title: 'Technical Writer', description: 'Write developer docs, API references and tutorials for our platform.', requirements: '2+ years technical writing for developer products.', location: 'Remote', isRemote: true, type: JobType.CONTRACT, minSalary: 800000, maxSalary: 1200000, currency: 'INR', skills: ['Technical Writing', 'Markdown', 'APIs'] },
      { c: 0, title: 'Software Engineering Intern', description: 'Work alongside senior engineers on real features in our cloud console.', requirements: 'Final-year CS student, familiarity with JavaScript or Python.', location: 'Bengaluru, India', isRemote: false, type: JobType.INTERNSHIP, minSalary: 30000, maxSalary: 40000, currency: 'INR', skills: ['JavaScript', 'Python', 'Git'] },
      { c: 1, title: 'Senior Mobile Developer (React Native)', description: 'Build our patient app for iOS and Android.', requirements: '4+ years mobile development, React Native preferred.', location: 'Remote', isRemote: true, type: JobType.FULL_TIME, minSalary: 120000, maxSalary: 160000, currency: 'USD', skills: ['React Native', 'TypeScript', 'iOS', 'Android'] },
      { c: 1, title: 'Clinical Operations Coordinator', description: 'Coordinate provider onboarding and day-to-day clinical operations.', requirements: '2+ years in healthcare operations.', location: 'San Francisco, CA', isRemote: false, type: JobType.FULL_TIME, minSalary: 65000, maxSalary: 85000, currency: 'USD', skills: ['Operations', 'Healthcare', 'Scheduling'] },
      { c: 1, title: 'Machine Learning Engineer', description: 'Develop models that predict patient no-shows and personalise care plans.', requirements: '3+ years ML, Python and production model deployment.', location: 'Remote', isRemote: true, type: JobType.FULL_TIME, minSalary: 140000, maxSalary: 180000, currency: 'USD', skills: ['Python', 'PyTorch', 'MLOps', 'SQL'] },
      { c: 2, title: 'Backend Engineer (Payments)', description: 'Design reliable, idempotent payment APIs and ledger services.', requirements: '4+ years backend, experience with payments or ledgers.', location: 'Pune, India', isRemote: true, type: JobType.FULL_TIME, minSalary: 1800000, maxSalary: 2800000, currency: 'INR', skills: ['Node.js', 'PostgreSQL', 'Kafka', 'Payments'] },
      { c: 2, title: 'Risk & Fraud Analyst', description: 'Monitor transactions and build rules to detect fraudulent activity.', requirements: '2+ years in fraud or risk analytics, strong SQL.', location: 'Pune, India', isRemote: false, type: JobType.FULL_TIME, minSalary: 1000000, maxSalary: 1600000, currency: 'INR', skills: ['SQL', 'Fraud Detection', 'Analytics'] },
      { c: 2, title: 'UI/UX Designer (Part-time)', description: 'Design dashboards and onboarding flows for our lending products.', requirements: '3+ years product design with a strong portfolio.', location: 'Remote', isRemote: true, type: JobType.PART_TIME, minSalary: 600000, maxSalary: 900000, currency: 'INR', skills: ['Figma', 'Design Systems', 'UX'] },
    ].map(({ c, ...job }) => ({
      ...job,
      companyId: companies[c].id,
      recruiterId: recruiterProfiles[c].id,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
    })),
  ];

  for (const job of jobSeeds) {
    const existing = await prisma.job.findFirst({
      where: { title: job.title, companyId: job.companyId },
    });
    if (existing) {
      await prisma.job.update({ where: { id: existing.id }, data: job });
    } else {
      await prisma.job.create({ data: job });
    }
  }

  await prisma.user.upsert({
    where: { email: 'admin@jobportal.example.com' },
    create: { email: 'admin@jobportal.example.com', passwordHash, role: Role.ADMIN },
    update: {},
  });

  const seekerSeeds = [
    {
      email: 'rahul.seeker@example.com',
      firstName: 'Rahul',
      lastName: 'Verma',
      headline: 'Full Stack Developer',
      location: 'Bengaluru, India',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      summary: '4 years building web apps for startups.',
    },
    {
      email: 'ananya.seeker@example.com',
      firstName: 'Ananya',
      lastName: 'Iyer',
      headline: 'Product Designer',
      location: 'San Francisco, CA',
      skills: ['Figma', 'UX Research', 'Prototyping'],
      summary: 'Designing healthcare and fintech products.',
    },
    {
      email: 'karan.seeker@example.com',
      firstName: 'Karan',
      lastName: 'Mehta',
      headline: 'DevOps Engineer',
      location: 'Pune, India',
      skills: ['Kubernetes', 'Terraform', 'Docker', 'AWS'],
      summary: 'Cloud automation and CI/CD specialist.',
    },
  ];

  const seekerProfiles = [];
  for (const { email, ...profile } of seekerSeeds) {
    const user = await prisma.user.upsert({
      where: { email },
      create: { email, passwordHash, role: Role.JOB_SEEKER },
      update: {},
    });
    seekerProfiles.push(
      await prisma.jobSeekerProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, ...profile },
        update: profile,
      })
    );
  }

  const publishedJobs = await prisma.job.findMany({
    where: { status: JobStatus.PUBLISHED },
    orderBy: { title: 'asc' },
  });
  const statuses = [
    ApplicationStatus.APPLIED,
    ApplicationStatus.UNDER_REVIEW,
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.INTERVIEW,
  ];
  for (const [i, seeker] of seekerProfiles.entries()) {
    for (const [j, job] of publishedJobs.slice(i, i + 3).entries()) {
      await prisma.application.upsert({
        where: { jobId_jobSeekerProfileId: { jobId: job.id, jobSeekerProfileId: seeker.id } },
        create: {
          jobId: job.id,
          jobSeekerProfileId: seeker.id,
          status: statuses[(i + j) % statuses.length],
          coverLetter: 'I am excited to apply for this role and believe my experience is a strong fit.',
        },
        update: {},
      });
    }
    const saved = publishedJobs[(i + 5) % publishedJobs.length];
    await prisma.savedJob.upsert({
      where: { jobSeekerProfileId_jobId: { jobSeekerProfileId: seeker.id, jobId: saved.id } },
      create: { jobSeekerProfileId: seeker.id, jobId: saved.id },
      update: {},
    });
  }

  console.log(`Seeded ${seekerProfiles.length} job seekers with applications and saved jobs, plus 1 admin.`);
  console.log(`Seeded ${companies.length} companies, ${recruiterProfiles.length} recruiters, ${jobSeeds.length} jobs.`);
  console.log(`All seeded recruiter accounts use password: ${SEED_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

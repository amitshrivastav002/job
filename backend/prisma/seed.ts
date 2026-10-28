import { PrismaClient, JobType, JobStatus, Role } from '@prisma/client';
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

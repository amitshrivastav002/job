-- Dummy company, recruiter and job vacancies. Safe to re-run (no duplicates).
-- Run in the Render Postgres shell / any SQL client connected to your DB.

INSERT INTO "Company" ("id", "name", "slug", "industry", "size", "description", "isVerified", "updatedAt")
VALUES (gen_random_uuid()::text, 'Demo Tech Pvt Ltd', 'demo-tech', 'Information Technology', '51-200',
        'Demo company used for sample job vacancies.', true, NOW())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "User" ("id", "email", "role", "updatedAt")
VALUES (gen_random_uuid()::text, 'recruiter@demo-tech.example.com', 'RECRUITER', NOW())
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "RecruiterProfile" ("id", "userId", "fullName", "title", "companyId", "isVerified", "updatedAt")
SELECT gen_random_uuid()::text, u."id", 'Demo Recruiter', 'Talent Acquisition', c."id", true, NOW()
FROM "User" u, "Company" c
WHERE u."email" = 'recruiter@demo-tech.example.com' AND c."slug" = 'demo-tech'
ON CONFLICT ("userId") DO NOTHING;

INSERT INTO "Job" ("id", "companyId", "recruiterId", "title", "description", "requirements", "location",
                   "isRemote", "type", "status", "minSalary", "maxSalary", "currency", "skills",
                   "publishedAt", "updatedAt")
SELECT gen_random_uuid()::text, c."id", r."id", v.title, v.description, v.requirements, v.location,
       v.is_remote, v.type::"JobType", 'PUBLISHED'::"JobStatus", v.min_salary, v.max_salary, v.currency,
       v.skills, NOW(), NOW()
FROM "Company" c
JOIN "RecruiterProfile" r ON r."companyId" = c."id"
CROSS JOIN (VALUES
  ('Senior Backend Engineer', 'Build and scale REST APIs and microservices.', '5+ years Node.js, PostgreSQL.', 'Bengaluru, India', true, 'FULL_TIME', 2200000, 3200000, 'INR', ARRAY['Node.js','TypeScript','PostgreSQL']),
  ('Frontend Developer (React)', 'Build responsive UIs for our web platform.', '3+ years React and TypeScript.', 'Remote', true, 'FULL_TIME', 1500000, 2400000, 'INR', ARRAY['React','TypeScript','CSS']),
  ('DevOps Engineer', 'Own CI/CD and Kubernetes infrastructure.', '3+ years Kubernetes, Terraform.', 'Hyderabad, India', false, 'FULL_TIME', 1800000, 2600000, 'INR', ARRAY['Kubernetes','Terraform','AWS']),
  ('Product Designer', 'Design intuitive user experiences end to end.', '4+ years product design, Figma.', 'Pune, India', false, 'FULL_TIME', 1400000, 2000000, 'INR', ARRAY['Figma','UX Research']),
  ('Data Analyst', 'Turn data into insights for product teams.', '2+ years SQL and BI tools.', 'Remote', true, 'PART_TIME', 600000, 900000, 'INR', ARRAY['SQL','Tableau','Python']),
  ('QA Automation Engineer', 'Maintain automated test suites for web and APIs.', '2+ years Playwright or Cypress.', 'Noida, India', false, 'CONTRACT', 1000000, 1600000, 'INR', ARRAY['Playwright','JavaScript']),
  ('Software Engineering Intern', 'Work with senior engineers on real features.', 'Final-year CS student.', 'Bengaluru, India', false, 'INTERNSHIP', 25000, 40000, 'INR', ARRAY['JavaScript','Git']),
  ('Marketing Manager', 'Lead demand generation and brand campaigns.', '4+ years B2B marketing.', 'Mumbai, India', false, 'FULL_TIME', 1400000, 2000000, 'INR', ARRAY['SEO','Content Strategy'])
) AS v(title, description, requirements, location, is_remote, type, min_salary, max_salary, currency, skills)
WHERE c."slug" = 'demo-tech'
  AND NOT EXISTS (SELECT 1 FROM "Job" j WHERE j."companyId" = c."id" AND j."title" = v.title);

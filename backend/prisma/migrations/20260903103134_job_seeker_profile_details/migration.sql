-- CreateEnum
CREATE TYPE "WorkPreference" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');

-- CreateEnum
CREATE TYPE "LanguageProficiency" AS ENUM ('BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE');

-- AlterTable (add new columns; firstName/lastName nullable until backfilled)
ALTER TABLE "JobSeekerProfile"
ADD COLUMN     "employmentPreferences" "JobType"[] DEFAULT ARRAY[]::"JobType"[],
ADD COLUMN     "expectedSalary" INTEGER,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isVisibleToRecruiters" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "noticePeriod" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "preferredLocations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "workPreference" "WorkPreference";

-- Backfill firstName/lastName from the existing fullName column
UPDATE "JobSeekerProfile"
SET "firstName" = COALESCE(NULLIF(split_part("fullName", ' ', 1), ''), 'Unknown'),
    "lastName" = COALESCE(
      NULLIF(trim(substring("fullName" from length(split_part("fullName", ' ', 1)) + 1)), ''),
      ''
    );

-- Enforce NOT NULL now that all rows are backfilled
ALTER TABLE "JobSeekerProfile" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "JobSeekerProfile" ALTER COLUMN "lastName" SET NOT NULL;

-- Drop the old combined column
ALTER TABLE "JobSeekerProfile" DROP COLUMN "fullName";

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "jobSeekerProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "jobSeekerProfileId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "jobSeekerProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "jobSeekerProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "credentialUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "jobSeekerProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "jobSeekerProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "proficiency" "LanguageProficiency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Experience_jobSeekerProfileId_idx" ON "Experience"("jobSeekerProfileId");

-- CreateIndex
CREATE INDEX "Education_jobSeekerProfileId_idx" ON "Education"("jobSeekerProfileId");

-- CreateIndex
CREATE INDEX "Project_jobSeekerProfileId_idx" ON "Project"("jobSeekerProfileId");

-- CreateIndex
CREATE INDEX "Certification_jobSeekerProfileId_idx" ON "Certification"("jobSeekerProfileId");

-- CreateIndex
CREATE INDEX "Achievement_jobSeekerProfileId_idx" ON "Achievement"("jobSeekerProfileId");

-- CreateIndex
CREATE INDEX "Language_jobSeekerProfileId_idx" ON "Language"("jobSeekerProfileId");

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_jobSeekerProfileId_fkey" FOREIGN KEY ("jobSeekerProfileId") REFERENCES "JobSeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_jobSeekerProfileId_fkey" FOREIGN KEY ("jobSeekerProfileId") REFERENCES "JobSeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_jobSeekerProfileId_fkey" FOREIGN KEY ("jobSeekerProfileId") REFERENCES "JobSeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_jobSeekerProfileId_fkey" FOREIGN KEY ("jobSeekerProfileId") REFERENCES "JobSeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_jobSeekerProfileId_fkey" FOREIGN KEY ("jobSeekerProfileId") REFERENCES "JobSeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_jobSeekerProfileId_fkey" FOREIGN KEY ("jobSeekerProfileId") REFERENCES "JobSeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

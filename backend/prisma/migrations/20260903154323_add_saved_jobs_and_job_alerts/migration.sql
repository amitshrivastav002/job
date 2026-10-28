-- CreateTable
CREATE TABLE "SavedJob" (
    "id" TEXT NOT NULL,
    "jobSeekerProfileId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobAlert" (
    "id" TEXT NOT NULL,
    "jobSeekerProfileId" TEXT NOT NULL,
    "keyword" TEXT,
    "location" TEXT,
    "jobType" "JobType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedJob_jobSeekerProfileId_idx" ON "SavedJob"("jobSeekerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedJob_jobSeekerProfileId_jobId_key" ON "SavedJob"("jobSeekerProfileId", "jobId");

-- CreateIndex
CREATE INDEX "JobAlert_jobSeekerProfileId_idx" ON "JobAlert"("jobSeekerProfileId");

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobSeekerProfileId_fkey" FOREIGN KEY ("jobSeekerProfileId") REFERENCES "JobSeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAlert" ADD CONSTRAINT "JobAlert_jobSeekerProfileId_fkey" FOREIGN KEY ("jobSeekerProfileId") REFERENCES "JobSeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

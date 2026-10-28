-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('GOOGLE', 'APPLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "oauthId" TEXT,
ADD COLUMN     "oauthProvider" "OAuthProvider",
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_oauthProvider_oauthId_key" ON "User"("oauthProvider", "oauthId");


/*
  Warnings:

  - Added the required column `type` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ComplaintType" AS ENUM ('RESOURCE', 'STUDENT', 'STUFF');

-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "type" "ComplaintType" NOT NULL;

-- DropEnum
DROP TYPE "ComplaintTypes";

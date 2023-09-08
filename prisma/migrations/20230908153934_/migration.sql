/*
  Warnings:

  - The primary key for the `Complaint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `complainId` on the `Complaint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_pkey",
DROP COLUMN "complainId",
ADD COLUMN     "complaintId" SERIAL NOT NULL,
ADD CONSTRAINT "Complaint_pkey" PRIMARY KEY ("complaintId");

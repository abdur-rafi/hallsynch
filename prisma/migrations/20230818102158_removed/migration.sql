/*
  Warnings:

  - You are about to drop the column `studentId` on the `MessManagerApplication` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessManagerApplication" DROP CONSTRAINT "MessManagerApplication_studentId_fkey";

-- AlterTable
ALTER TABLE "MessManagerApplication" DROP COLUMN "studentId";

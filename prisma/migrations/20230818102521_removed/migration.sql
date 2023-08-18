/*
  Warnings:

  - You are about to drop the column `studentStudentId` on the `MessManager` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessManager" DROP CONSTRAINT "MessManager_studentStudentId_fkey";

-- AlterTable
ALTER TABLE "MessManager" DROP COLUMN "studentStudentId";

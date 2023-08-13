/*
  Warnings:

  - You are about to drop the column `studentStudentId` on the `Rating` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_studentStudentId_fkey";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "studentStudentId";

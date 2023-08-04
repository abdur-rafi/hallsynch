/*
  Warnings:

  - You are about to drop the column `newApplicationNewApplicationId` on the `AttachedFiles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttachedFiles" DROP CONSTRAINT "AttachedFiles_newApplicationNewApplicationId_fkey";

-- AlterTable
ALTER TABLE "AttachedFiles" DROP COLUMN "newApplicationNewApplicationId";

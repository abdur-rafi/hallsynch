/*
  Warnings:

  - Added the required column `shortName` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "shortName" TEXT NOT NULL;

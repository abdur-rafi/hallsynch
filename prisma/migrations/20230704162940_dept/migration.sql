/*
  Warnings:

  - Added the required column `deptCode` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "deptCode" CHAR(2) NOT NULL;

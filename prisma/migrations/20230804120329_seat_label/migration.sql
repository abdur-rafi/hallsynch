/*
  Warnings:

  - Added the required column `seatLabel` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "seatLabel" CHAR(1) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `fromTime` on the `TempApplication` table. All the data in the column will be lost.
  - Added the required column `from` to the `TempApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TempApplication" DROP COLUMN "fromTime",
ADD COLUMN     "from" DATE NOT NULL;

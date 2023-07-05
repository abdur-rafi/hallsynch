/*
  Warnings:

  - You are about to drop the column `applicationId` on the `AttachedFiles` table. All the data in the column will be lost.
  - The primary key for the `NewApplication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `NewApplication` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdate` on the `NewApplication` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `NewApplication` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `NewApplication` table. All the data in the column will be lost.
  - The primary key for the `RoomChangeApplication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `RoomChangeApplication` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdate` on the `RoomChangeApplication` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `RoomChangeApplication` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `RoomChangeApplication` table. All the data in the column will be lost.
  - The primary key for the `TempApplication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `TempApplication` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdate` on the `TempApplication` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `TempApplication` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `TempApplication` table. All the data in the column will be lost.
  - You are about to drop the column `applicationId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[applicationId]` on the table `NewApplication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionnaireId]` on the table `NewApplication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[applicationId]` on the table `RoomChangeApplication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[applicationId]` on the table `TempApplication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomChangeApplicationId,studentId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `newApplicationId` to the `AttachedFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `q1` to the `NewSeatQuestionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `q2` to the `NewSeatQuestionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomChangeApplicationId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'REVISE';

-- DropForeignKey
ALTER TABLE "AttachedFiles" DROP CONSTRAINT "AttachedFiles_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "NewApplication" DROP CONSTRAINT "NewApplication_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Revision" DROP CONSTRAINT "Revision_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "RoomChangeApplication" DROP CONSTRAINT "RoomChangeApplication_studentId_fkey";

-- DropForeignKey
ALTER TABLE "TempApplication" DROP CONSTRAINT "TempApplication_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_applicationId_fkey";

-- DropIndex
DROP INDEX "Vote_applicationId_studentId_key";

-- AlterTable
ALTER TABLE "AttachedFiles" DROP COLUMN "applicationId",
ADD COLUMN     "newApplicationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NewApplication" DROP CONSTRAINT "NewApplication_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "lastUpdate",
DROP COLUMN "status",
DROP COLUMN "studentId",
ADD COLUMN     "newApplicationId" SERIAL NOT NULL,
ALTER COLUMN "applicationId" DROP DEFAULT,
ADD CONSTRAINT "NewApplication_pkey" PRIMARY KEY ("newApplicationId");
DROP SEQUENCE "NewApplication_applicationId_seq";

-- AlterTable
ALTER TABLE "NewSeatQuestionnaire" ADD COLUMN     "q1" BOOLEAN NOT NULL,
ADD COLUMN     "q2" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "RoomChangeApplication" DROP CONSTRAINT "RoomChangeApplication_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "lastUpdate",
DROP COLUMN "status",
DROP COLUMN "studentId",
ADD COLUMN     "roomChangeApplicationId" SERIAL NOT NULL,
ALTER COLUMN "applicationId" DROP DEFAULT,
ADD CONSTRAINT "RoomChangeApplication_pkey" PRIMARY KEY ("roomChangeApplicationId");
DROP SEQUENCE "RoomChangeApplication_applicationId_seq";

-- AlterTable
ALTER TABLE "TempApplication" DROP CONSTRAINT "TempApplication_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "lastUpdate",
DROP COLUMN "status",
DROP COLUMN "studentId",
ALTER COLUMN "applicationId" DROP DEFAULT;
DROP SEQUENCE "TempApplication_applicationId_seq";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "applicationId",
ADD COLUMN     "roomChangeApplicationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SeatApplication" (
    "applicationId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "SeatApplication_pkey" PRIMARY KEY ("applicationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewApplication_applicationId_key" ON "NewApplication"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "NewApplication_questionnaireId_key" ON "NewApplication"("questionnaireId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomChangeApplication_applicationId_key" ON "RoomChangeApplication"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "TempApplication_applicationId_key" ON "TempApplication"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_roomChangeApplicationId_studentId_key" ON "Vote"("roomChangeApplicationId", "studentId");

-- AddForeignKey
ALTER TABLE "SeatApplication" ADD CONSTRAINT "SeatApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewApplication" ADD CONSTRAINT "NewApplication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SeatApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttachedFiles" ADD CONSTRAINT "AttachedFiles_newApplicationId_fkey" FOREIGN KEY ("newApplicationId") REFERENCES "NewApplication"("newApplicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SeatApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SeatApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChangeApplication" ADD CONSTRAINT "RoomChangeApplication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SeatApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_roomChangeApplicationId_fkey" FOREIGN KEY ("roomChangeApplicationId") REFERENCES "RoomChangeApplication"("roomChangeApplicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

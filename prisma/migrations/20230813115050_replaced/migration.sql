/*
  Warnings:

  - You are about to drop the column `studentId` on the `MessManager` table. All the data in the column will be lost.
  - Added the required column `residencyId` to the `MessManager` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MessManager" DROP CONSTRAINT "MessManager_studentId_fkey";

-- AlterTable
ALTER TABLE "MessManager" DROP COLUMN "studentId",
ADD COLUMN     "residencyId" INTEGER NOT NULL,
ADD COLUMN     "studentStudentId" INTEGER;

-- AddForeignKey
ALTER TABLE "MessManager" ADD CONSTRAINT "MessManager_residencyId_fkey" FOREIGN KEY ("residencyId") REFERENCES "Residency"("residencyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessManager" ADD CONSTRAINT "MessManager_studentStudentId_fkey" FOREIGN KEY ("studentStudentId") REFERENCES "Student"("studentId") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `week` on the `Feedback` table. All the data in the column will be lost.
  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentId` on the `Rating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[startMealPlanId]` on the table `Feedback` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[endMealPlanId]` on the table `Feedback` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endMealPlanId` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messManagerId` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMealPlanId` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residencyId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_studentId_fkey";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "week",
ADD COLUMN     "endMealPlanId" INTEGER NOT NULL,
ADD COLUMN     "messManagerId" INTEGER NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startMealPlanId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN     "messManagerId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_pkey",
DROP COLUMN "studentId",
ADD COLUMN     "givenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "residencyId" INTEGER NOT NULL,
ADD COLUMN     "studentStudentId" INTEGER,
ADD CONSTRAINT "Rating_pkey" PRIMARY KEY ("feedbackId", "residencyId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_startMealPlanId_key" ON "Feedback"("startMealPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_endMealPlanId_key" ON "Feedback"("endMealPlanId");

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_messManagerId_fkey" FOREIGN KEY ("messManagerId") REFERENCES "MessManager"("messManagerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_messManagerId_fkey" FOREIGN KEY ("messManagerId") REFERENCES "MessManager"("messManagerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_startMealPlanId_fkey" FOREIGN KEY ("startMealPlanId") REFERENCES "MealPlan"("mealPlanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_endMealPlanId_fkey" FOREIGN KEY ("endMealPlanId") REFERENCES "MealPlan"("mealPlanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_residencyId_fkey" FOREIGN KEY ("residencyId") REFERENCES "Residency"("residencyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_studentStudentId_fkey" FOREIGN KEY ("studentStudentId") REFERENCES "Student"("studentId") ON DELETE SET NULL ON UPDATE CASCADE;

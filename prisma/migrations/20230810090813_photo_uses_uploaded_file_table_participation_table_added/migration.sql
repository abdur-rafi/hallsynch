/*
  Warnings:

  - You are about to drop the column `filePath` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `uploadedFileId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "filePath",
ADD COLUMN     "uploadedFileId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Participation" (
    "mealPlanId" INTEGER NOT NULL,
    "residencyId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Participation_mealPlanId_residencyId_key" ON "Participation"("mealPlanId", "residencyId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_uploadedFileId_fkey" FOREIGN KEY ("uploadedFileId") REFERENCES "UploadedFile"("uploadedFileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("mealPlanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_residencyId_fkey" FOREIGN KEY ("residencyId") REFERENCES "Residency"("residencyId") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `Preference` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentId` on the `Preference` table. All the data in the column will be lost.
  - Added the required column `residencyId` to the `Preference` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_studentId_fkey";

-- AlterTable
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_pkey",
DROP COLUMN "studentId",
ADD COLUMN     "residencyId" INTEGER NOT NULL,
ADD CONSTRAINT "Preference_pkey" PRIMARY KEY ("mealPlanId", "itemId", "residencyId");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_residencyId_fkey" FOREIGN KEY ("residencyId") REFERENCES "Residency"("residencyId") ON DELETE RESTRICT ON UPDATE CASCADE;

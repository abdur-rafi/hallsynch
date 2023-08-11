/*
  Warnings:

  - You are about to drop the `_MealPlanToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MealPlanToStudent" DROP CONSTRAINT "_MealPlanToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_MealPlanToStudent" DROP CONSTRAINT "_MealPlanToStudent_B_fkey";

-- DropTable
DROP TABLE "_MealPlanToStudent";

-- CreateTable
CREATE TABLE "OptedOut" (
    "residencyId" INTEGER NOT NULL,
    "mealPlanId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "OptedOut_mealPlanId_residencyId_key" ON "OptedOut"("mealPlanId", "residencyId");

-- AddForeignKey
ALTER TABLE "OptedOut" ADD CONSTRAINT "OptedOut_residencyId_fkey" FOREIGN KEY ("residencyId") REFERENCES "Residency"("residencyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptedOut" ADD CONSTRAINT "OptedOut_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("mealPlanId") ON DELETE RESTRICT ON UPDATE CASCADE;

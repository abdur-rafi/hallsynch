/*
  Warnings:

  - Changed the type of `mealTime` on the `MealPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MealTime" AS ENUM ('LUNCH', 'DINNER');

-- AlterTable
ALTER TABLE "MealPlan" DROP COLUMN "mealTime",
ADD COLUMN     "mealTime" "MealTime" NOT NULL;

-- DropEnum
DROP TYPE "MealTime_";

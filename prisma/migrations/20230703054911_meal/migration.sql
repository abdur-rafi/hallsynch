/*
  Warnings:

  - You are about to drop the column `mealTimeId` on the `MealPlan` table. All the data in the column will be lost.
  - You are about to drop the `MealTime` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mealTime` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MealTime_" AS ENUM ('LUNCH', 'DINNER');

-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_mealTimeId_fkey";

-- AlterTable
ALTER TABLE "MealPlan" DROP COLUMN "mealTimeId",
ADD COLUMN     "mealTime" "MealTime_" NOT NULL;

-- DropTable
DROP TABLE "MealTime";

/*
  Warnings:

  - You are about to drop the column `roomChangeApplicationId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `RoomChangeApplication` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[seatChangeApplicationId,studentId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seatChangeApplicationId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomChangeApplication" DROP CONSTRAINT "RoomChangeApplication_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "RoomChangeApplication" DROP CONSTRAINT "RoomChangeApplication_toRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_roomChangeApplicationId_fkey";

-- DropIndex
DROP INDEX "Vote_roomChangeApplicationId_studentId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "roomChangeApplicationId",
ADD COLUMN     "seatChangeApplicationId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "RoomChangeApplication";

-- CreateTable
CREATE TABLE "SeatChangeApplication" (
    "seatChangeApplicationId" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "toRoomId" INTEGER NOT NULL,

    CONSTRAINT "SeatChangeApplication_pkey" PRIMARY KEY ("seatChangeApplicationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeatChangeApplication_applicationId_key" ON "SeatChangeApplication"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_seatChangeApplicationId_studentId_key" ON "Vote"("seatChangeApplicationId", "studentId");

-- AddForeignKey
ALTER TABLE "SeatChangeApplication" ADD CONSTRAINT "SeatChangeApplication_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SeatApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatChangeApplication" ADD CONSTRAINT "SeatChangeApplication_toRoomId_fkey" FOREIGN KEY ("toRoomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_seatChangeApplicationId_fkey" FOREIGN KEY ("seatChangeApplicationId") REFERENCES "SeatChangeApplication"("seatChangeApplicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

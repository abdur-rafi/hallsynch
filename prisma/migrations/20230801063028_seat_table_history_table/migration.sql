/*
  Warnings:

  - You are about to drop the column `roomId` on the `Residency` table. All the data in the column will be lost.
  - You are about to drop the column `roomCapacity` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seatId]` on the table `Residency` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seatId` to the `Residency` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Residency" DROP CONSTRAINT "Residency_roomId_fkey";

-- AlterTable
ALTER TABLE "Residency" DROP COLUMN "roomId",
ADD COLUMN     "seatId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomCapacity";

-- CreateTable
CREATE TABLE "ApplicationApproveHistory" (
    "applicationId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,
    "authorityId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Seat" (
    "seatId" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("seatId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationApproveHistory_applicationId_key" ON "ApplicationApproveHistory"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Residency_seatId_key" ON "Residency"("seatId");

-- AddForeignKey
ALTER TABLE "Residency" ADD CONSTRAINT "Residency_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("seatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationApproveHistory" ADD CONSTRAINT "ApplicationApproveHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SeatApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationApproveHistory" ADD CONSTRAINT "ApplicationApproveHistory_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("seatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationApproveHistory" ADD CONSTRAINT "ApplicationApproveHistory_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "Authority"("authorityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

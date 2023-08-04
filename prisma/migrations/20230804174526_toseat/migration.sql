/*
  Warnings:

  - You are about to drop the column `toRoomId` on the `SeatChangeApplication` table. All the data in the column will be lost.
  - Added the required column `toSeatId` to the `SeatChangeApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SeatChangeApplication" DROP CONSTRAINT "SeatChangeApplication_toRoomId_fkey";

-- AlterTable
ALTER TABLE "SeatChangeApplication" DROP COLUMN "toRoomId",
ADD COLUMN     "roomRoomId" INTEGER,
ADD COLUMN     "toSeatId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SeatChangeApplication" ADD CONSTRAINT "SeatChangeApplication_toSeatId_fkey" FOREIGN KEY ("toSeatId") REFERENCES "Seat"("seatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatChangeApplication" ADD CONSTRAINT "SeatChangeApplication_roomRoomId_fkey" FOREIGN KEY ("roomRoomId") REFERENCES "Room"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;

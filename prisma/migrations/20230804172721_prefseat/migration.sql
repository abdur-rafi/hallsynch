/*
  Warnings:

  - You are about to drop the column `prefRoomId` on the `TempApplication` table. All the data in the column will be lost.
  - Added the required column `prefSeatId` to the `TempApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TempApplication" DROP CONSTRAINT "TempApplication_prefRoomId_fkey";

-- AlterTable
ALTER TABLE "TempApplication" DROP COLUMN "prefRoomId",
ADD COLUMN     "prefSeatId" INTEGER NOT NULL,
ADD COLUMN     "roomRoomId" INTEGER;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_prefSeatId_fkey" FOREIGN KEY ("prefSeatId") REFERENCES "Seat"("seatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_roomRoomId_fkey" FOREIGN KEY ("roomRoomId") REFERENCES "Room"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;

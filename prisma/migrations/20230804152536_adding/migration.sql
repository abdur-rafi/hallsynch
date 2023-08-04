/*
  Warnings:

  - A unique constraint covering the columns `[floorNo]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[floorId,roomNo]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Floor_floorNo_key" ON "Floor"("floorNo");

-- CreateIndex
CREATE UNIQUE INDEX "Room_floorId_roomNo_key" ON "Room"("floorId", "roomNo");

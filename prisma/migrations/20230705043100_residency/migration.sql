/*
  Warnings:

  - Added the required column `floorId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomCapacity` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `roomNo` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "floorId" INTEGER NOT NULL,
ADD COLUMN     "roomCapacity" INTEGER NOT NULL,
DROP COLUMN "roomNo",
ADD COLUMN     "roomNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Residency" (
    "residencyId" SERIAL NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Residency_pkey" PRIMARY KEY ("residencyId")
);

-- CreateTable
CREATE TABLE "Floor" (
    "floorId" SERIAL NOT NULL,
    "floorNo" INTEGER NOT NULL,
    "roomLabelLen" INTEGER NOT NULL,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("floorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Residency_studentId_key" ON "Residency"("studentId");

-- AddForeignKey
ALTER TABLE "Residency" ADD CONSTRAINT "Residency_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Residency" ADD CONSTRAINT "Residency_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("floorId") ON DELETE RESTRICT ON UPDATE CASCADE;

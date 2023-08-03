/*
  Warnings:

  - The primary key for the `AttachedFiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fileId` on the `AttachedFiles` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `AttachedFiles` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `AttachedFiles` table. All the data in the column will be lost.
  - You are about to drop the column `newApplicationId` on the `AttachedFiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uploadedFileId,applicationId]` on the table `AttachedFiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationId` to the `AttachedFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedFileId` to the `AttachedFiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttachedFiles" DROP CONSTRAINT "AttachedFiles_newApplicationId_fkey";

-- AlterTable
ALTER TABLE "AttachedFiles" DROP CONSTRAINT "AttachedFiles_pkey",
DROP COLUMN "fileId",
DROP COLUMN "fileName",
DROP COLUMN "filePath",
DROP COLUMN "newApplicationId",
ADD COLUMN     "applicationId" INTEGER NOT NULL,
ADD COLUMN     "newApplicationNewApplicationId" INTEGER,
ADD COLUMN     "uploadedFileId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UploadedFile" (
    "uploadedFileId" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("uploadedFileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttachedFiles_uploadedFileId_applicationId_key" ON "AttachedFiles"("uploadedFileId", "applicationId");

-- AddForeignKey
ALTER TABLE "AttachedFiles" ADD CONSTRAINT "AttachedFiles_uploadedFileId_fkey" FOREIGN KEY ("uploadedFileId") REFERENCES "UploadedFile"("uploadedFileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttachedFiles" ADD CONSTRAINT "AttachedFiles_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SeatApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttachedFiles" ADD CONSTRAINT "AttachedFiles_newApplicationNewApplicationId_fkey" FOREIGN KEY ("newApplicationNewApplicationId") REFERENCES "NewApplication"("newApplicationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `preferredFrom` on the `MessManagerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `preferredTo` on the `MessManagerApplication` table. All the data in the column will be lost.
  - Added the required column `callId` to the `MessManagerApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessManagerApplication" DROP COLUMN "preferredFrom",
DROP COLUMN "preferredTo",
ADD COLUMN     "callId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MessManagerApplication" ADD CONSTRAINT "MessManagerApplication_callId_fkey" FOREIGN KEY ("callId") REFERENCES "MessManagerApplicationCall"("callId") ON DELETE RESTRICT ON UPDATE CASCADE;

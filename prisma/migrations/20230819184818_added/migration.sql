/*
  Warnings:

  - You are about to drop the column `from` on the `MessManager` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `MessManager` table. All the data in the column will be lost.
  - Added the required column `callId` to the `MessManager` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessManager" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "callId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MessManager" ADD CONSTRAINT "MessManager_callId_fkey" FOREIGN KEY ("callId") REFERENCES "MessManagerApplicationCall"("callId") ON DELETE RESTRICT ON UPDATE CASCADE;

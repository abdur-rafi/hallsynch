/*
  Warnings:

  - You are about to drop the column `preferredTimeRange` on the `MessManagerApplication` table. All the data in the column will be lost.
  - Added the required column `preferredFrom` to the `MessManagerApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredTo` to the `MessManagerApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residencyId` to the `MessManagerApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessManagerApplication" DROP COLUMN "preferredTimeRange",
ADD COLUMN     "preferredFrom" DATE NOT NULL,
ADD COLUMN     "preferredTo" DATE NOT NULL,
ADD COLUMN     "residencyId" INTEGER NOT NULL,
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "MessManagerApplication" ADD CONSTRAINT "MessManagerApplication_residencyId_fkey" FOREIGN KEY ("residencyId") REFERENCES "Residency"("residencyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "ApplicationApproveHistory" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "RejectionHistory" (
    "applicationId" INTEGER NOT NULL,
    "authorityId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "RejectionHistory_applicationId_key" ON "RejectionHistory"("applicationId");

-- AddForeignKey
ALTER TABLE "RejectionHistory" ADD CONSTRAINT "RejectionHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "SeatApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectionHistory" ADD CONSTRAINT "RejectionHistory_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "Authority"("authorityId") ON DELETE RESTRICT ON UPDATE CASCADE;

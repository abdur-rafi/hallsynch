/*
  Warnings:

  - A unique constraint covering the columns `[callId,residencyId]` on the table `MessManagerApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MessManagerApplication_callId_residencyId_key" ON "MessManagerApplication"("callId", "residencyId");

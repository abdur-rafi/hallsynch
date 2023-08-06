/*
  Warnings:

  - A unique constraint covering the columns `[voteId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_voteId_key" ON "Notification"("voteId");

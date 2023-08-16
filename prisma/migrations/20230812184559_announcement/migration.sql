-- CreateTable
CREATE TABLE "Announcement" (
    "announcementId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorityId" INTEGER NOT NULL,
    "messManagerId" INTEGER NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("announcementId")
);

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "Authority"("authorityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_messManagerId_fkey" FOREIGN KEY ("messManagerId") REFERENCES "MessManager"("messManagerId") ON DELETE RESTRICT ON UPDATE CASCADE;

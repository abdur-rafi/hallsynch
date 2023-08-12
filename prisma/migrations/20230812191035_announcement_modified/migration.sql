-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_authorityId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_messManagerId_fkey";

-- AlterTable
ALTER TABLE "Announcement" ALTER COLUMN "authorityId" DROP NOT NULL,
ALTER COLUMN "messManagerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "Authority"("authorityId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_messManagerId_fkey" FOREIGN KEY ("messManagerId") REFERENCES "MessManager"("messManagerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "AuthorityRole" AS ENUM ('PROVOST', 'ASSISTANT_PROVOST', 'DINING_STUFF');

-- CreateTable
CREATE TABLE "Authority" (
    "authorityId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "AuthorityRole" NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Authority_pkey" PRIMARY KEY ("authorityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authority_email_key" ON "Authority"("email");

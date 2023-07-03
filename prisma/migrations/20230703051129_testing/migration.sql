-- CreateEnum
CREATE TYPE "ComplaintTypes" AS ENUM ('RESOURCE', 'STUDENT', 'STUFF');

-- CreateTable
CREATE TABLE "MessManager" (
    "messManagerId" SERIAL NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "assingedAt" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "MessManager_pkey" PRIMARY KEY ("messManagerId")
);

-- CreateTable
CREATE TABLE "MessManagerApplication" (
    "applicationId" SERIAL NOT NULL,
    "preferredTimeRange" TIMESTAMP(3) NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "MessManagerApplication_pkey" PRIMARY KEY ("applicationId")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "complainId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("complainId")
);

-- AddForeignKey
ALTER TABLE "MessManager" ADD CONSTRAINT "MessManager_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessManagerApplication" ADD CONSTRAINT "MessManagerApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

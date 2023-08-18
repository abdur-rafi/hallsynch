-- CreateTable
CREATE TABLE "MessManagerApplicationCall" (
    "callId" SERIAL NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "MessManagerApplicationCall_pkey" PRIMARY KEY ("callId")
);

-- AddForeignKey
ALTER TABLE "MessManagerApplicationCall" ADD CONSTRAINT "MessManagerApplicationCall_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Authority"("authorityId") ON DELETE RESTRICT ON UPDATE CASCADE;

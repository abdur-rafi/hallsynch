-- CreateTable
CREATE TABLE "TempResidencyHistory" (
    "tempResidencyHistoryId" SERIAL NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,

    CONSTRAINT "TempResidencyHistory_pkey" PRIMARY KEY ("tempResidencyHistoryId")
);

-- AddForeignKey
ALTER TABLE "TempResidencyHistory" ADD CONSTRAINT "TempResidencyHistory_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("seatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempResidencyHistory" ADD CONSTRAINT "TempResidencyHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

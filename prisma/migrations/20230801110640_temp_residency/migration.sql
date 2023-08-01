-- CreateTable
CREATE TABLE "TempResidency" (
    "tempResidencyId" SERIAL NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "days" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,

    CONSTRAINT "TempResidency_pkey" PRIMARY KEY ("tempResidencyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempResidency_studentId_key" ON "TempResidency"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "TempResidency_seatId_key" ON "TempResidency"("seatId");

-- AddForeignKey
ALTER TABLE "TempResidency" ADD CONSTRAINT "TempResidency_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("seatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempResidency" ADD CONSTRAINT "TempResidency_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

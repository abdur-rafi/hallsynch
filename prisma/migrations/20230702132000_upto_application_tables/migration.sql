-- CreateTable
CREATE TABLE "Student" (
    "studentId" SERIAL NOT NULL,
    "student9DigitId" CHAR(9) NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "batchId" INTEGER NOT NULL,
    "levelTermId" INTEGER NOT NULL,
    "residencyId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "Department" (
    "departmentId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("departmentId")
);

-- CreateTable
CREATE TABLE "Batch" (
    "batchId" SERIAL NOT NULL,
    "year" CHAR(4) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("batchId")
);

-- CreateTable
CREATE TABLE "LevelTerm" (
    "levelTermId" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "LevelTerm_pkey" PRIMARY KEY ("levelTermId")
);

-- CreateTable
CREATE TABLE "Residency" (
    "residencyId" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Residency_pkey" PRIMARY KEY ("residencyId")
);

-- CreateTable
CREATE TABLE "NewApplication" (
    "applicationId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "questionnaireId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "NewApplication_pkey" PRIMARY KEY ("applicationId")
);

-- CreateTable
CREATE TABLE "AttachedFiles" (
    "fileId" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "applicationId" INTEGER NOT NULL,

    CONSTRAINT "AttachedFiles_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "TempApplication" (
    "applicationId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "fromTime" TIMESTAMP(3) NOT NULL,
    "days" INTEGER NOT NULL,
    "questionnaireId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "prefRoomId" INTEGER NOT NULL,

    CONSTRAINT "TempApplication_pkey" PRIMARY KEY ("applicationId")
);

-- CreateTable
CREATE TABLE "TempQuestionnaire" (
    "questionnaireId" SERIAL NOT NULL,

    CONSTRAINT "TempQuestionnaire_pkey" PRIMARY KEY ("questionnaireId")
);

-- CreateTable
CREATE TABLE "Revision" (
    "revisionId" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "applicationId" INTEGER NOT NULL,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("revisionId")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomId" SERIAL NOT NULL,
    "roomNo" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "RoomChangeApplication" (
    "applicationId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "toRoomId" INTEGER NOT NULL,

    CONSTRAINT "RoomChangeApplication_pkey" PRIMARY KEY ("applicationId")
);

-- CreateTable
CREATE TABLE "NewSeatQuestionnaire" (
    "questionnaireId" SERIAL NOT NULL,

    CONSTRAINT "NewSeatQuestionnaire_pkey" PRIMARY KEY ("questionnaireId")
);

-- CreateTable
CREATE TABLE "ApplicationStatus" (
    "statusId" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "ApplicationStatus_pkey" PRIMARY KEY ("statusId")
);

-- CreateTable
CREATE TABLE "Vote" (
    "voteId" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("voteId")
);

-- CreateTable
CREATE TABLE "VoteStatus" (
    "voteStatusId" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "VoteStatus_pkey" PRIMARY KEY ("voteStatusId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_student9DigitId_key" ON "Student"("student9DigitId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_applicationId_studentId_key" ON "Vote"("applicationId", "studentId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("batchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_levelTermId_fkey" FOREIGN KEY ("levelTermId") REFERENCES "LevelTerm"("levelTermId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_residencyId_fkey" FOREIGN KEY ("residencyId") REFERENCES "Residency"("residencyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewApplication" ADD CONSTRAINT "NewApplication_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "NewSeatQuestionnaire"("questionnaireId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewApplication" ADD CONSTRAINT "NewApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewApplication" ADD CONSTRAINT "NewApplication_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "ApplicationStatus"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttachedFiles" ADD CONSTRAINT "AttachedFiles_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "NewApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "TempQuestionnaire"("questionnaireId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "ApplicationStatus"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_prefRoomId_fkey" FOREIGN KEY ("prefRoomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "NewApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChangeApplication" ADD CONSTRAINT "RoomChangeApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChangeApplication" ADD CONSTRAINT "RoomChangeApplication_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "ApplicationStatus"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChangeApplication" ADD CONSTRAINT "RoomChangeApplication_toRoomId_fkey" FOREIGN KEY ("toRoomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RoomChangeApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VoteStatus"("voteStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

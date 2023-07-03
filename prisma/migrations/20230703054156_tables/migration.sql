-- CreateEnum
CREATE TYPE "ResidencyStatus" AS ENUM ('ATTACHED', 'RESIDENT', 'TEMP_RESIDENT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VoteStatus" AS ENUM ('YES', 'NO', 'NOT_VOTED');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('RICE', 'VEG', 'NON_VEG');

-- CreateEnum
CREATE TYPE "RatingType" AS ENUM ('QUALITY', 'QUANTITY', 'MANAGEMENT');

-- CreateEnum
CREATE TYPE "ComplaintType" AS ENUM ('RESOURCE', 'STUDENT', 'STUFF');

-- CreateTable
CREATE TABLE "Student" (
    "studentId" SERIAL NOT NULL,
    "student9DigitId" CHAR(9) NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "residencyStatus" "ResidencyStatus" NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "batchId" INTEGER NOT NULL,
    "levelTermId" INTEGER NOT NULL,

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
CREATE TABLE "NewApplication" (
    "applicationId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "questionnaireId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

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
    "status" "ApplicationStatus" NOT NULL,
    "questionnaireId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
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
    "status" "ApplicationStatus" NOT NULL,
    "studentId" INTEGER NOT NULL,
    "toRoomId" INTEGER NOT NULL,

    CONSTRAINT "RoomChangeApplication_pkey" PRIMARY KEY ("applicationId")
);

-- CreateTable
CREATE TABLE "NewSeatQuestionnaire" (
    "questionnaireId" SERIAL NOT NULL,

    CONSTRAINT "NewSeatQuestionnaire_pkey" PRIMARY KEY ("questionnaireId")
);

-- CreateTable
CREATE TABLE "Vote" (
    "voteId" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "status" "VoteStatus" NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("voteId")
);

-- CreateTable
CREATE TABLE "Item" (
    "itemId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "photoId" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Photo" (
    "photoId" SERIAL NOT NULL,
    "filePath" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("photoId")
);

-- CreateTable
CREATE TABLE "Meal" (
    "mealId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("mealId")
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "mealPlanId" SERIAL NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "mealId" INTEGER NOT NULL,
    "mealTimeId" INTEGER NOT NULL,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("mealPlanId")
);

-- CreateTable
CREATE TABLE "MealTime" (
    "mealTimeId" SERIAL NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "MealTime_pkey" PRIMARY KEY ("mealTimeId")
);

-- CreateTable
CREATE TABLE "CupCount" (
    "cupcount" INTEGER NOT NULL,
    "mealPlanId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "CupCount_pkey" PRIMARY KEY ("mealPlanId","itemId")
);

-- CreateTable
CREATE TABLE "Preference" (
    "order" INTEGER NOT NULL,
    "mealPlanId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("mealPlanId","itemId","studentId")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "feedbackId" SERIAL NOT NULL,
    "week" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedbackId")
);

-- CreateTable
CREATE TABLE "Rating" (
    "rating" DOUBLE PRECISION NOT NULL,
    "type" "RatingType" NOT NULL,
    "feedbackId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("feedbackId","studentId","type")
);

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
    "type" "ComplaintType" NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("complainId")
);

-- CreateTable
CREATE TABLE "_ItemToMeal" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MealPlanToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_student9DigitId_key" ON "Student"("student9DigitId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_applicationId_studentId_key" ON "Vote"("applicationId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToMeal_AB_unique" ON "_ItemToMeal"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToMeal_B_index" ON "_ItemToMeal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MealPlanToStudent_AB_unique" ON "_MealPlanToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_MealPlanToStudent_B_index" ON "_MealPlanToStudent"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("batchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_levelTermId_fkey" FOREIGN KEY ("levelTermId") REFERENCES "LevelTerm"("levelTermId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewApplication" ADD CONSTRAINT "NewApplication_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "NewSeatQuestionnaire"("questionnaireId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewApplication" ADD CONSTRAINT "NewApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttachedFiles" ADD CONSTRAINT "AttachedFiles_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "NewApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "TempQuestionnaire"("questionnaireId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempApplication" ADD CONSTRAINT "TempApplication_prefRoomId_fkey" FOREIGN KEY ("prefRoomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "NewApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChangeApplication" ADD CONSTRAINT "RoomChangeApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChangeApplication" ADD CONSTRAINT "RoomChangeApplication_toRoomId_fkey" FOREIGN KEY ("toRoomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RoomChangeApplication"("applicationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("photoId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("mealId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_mealTimeId_fkey" FOREIGN KEY ("mealTimeId") REFERENCES "MealTime"("mealTimeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CupCount" ADD CONSTRAINT "CupCount_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("mealPlanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CupCount" ADD CONSTRAINT "CupCount_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("mealPlanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("feedbackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessManager" ADD CONSTRAINT "MessManager_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessManagerApplication" ADD CONSTRAINT "MessManagerApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToMeal" ADD CONSTRAINT "_ItemToMeal_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToMeal" ADD CONSTRAINT "_ItemToMeal_B_fkey" FOREIGN KEY ("B") REFERENCES "Meal"("mealId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealPlanToStudent" ADD CONSTRAINT "_MealPlanToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "MealPlan"("mealPlanId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealPlanToStudent" ADD CONSTRAINT "_MealPlanToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;

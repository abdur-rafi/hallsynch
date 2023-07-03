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
    "feedbackId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("feedbackId","studentId","typeId")
);

-- CreateTable
CREATE TABLE "RatingType" (
    "ratingTypeId" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "RatingType_pkey" PRIMARY KEY ("ratingTypeId")
);

-- CreateTable
CREATE TABLE "_MealPlanToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MealPlanToStudent_AB_unique" ON "_MealPlanToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_MealPlanToStudent_B_index" ON "_MealPlanToStudent"("B");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("mealPlanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("feedbackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "RatingType"("ratingTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealPlanToStudent" ADD CONSTRAINT "_MealPlanToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "MealPlan"("mealPlanId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealPlanToStudent" ADD CONSTRAINT "_MealPlanToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;

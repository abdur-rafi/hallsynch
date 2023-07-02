-- CreateTable
CREATE TABLE "Item" (
    "itemId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photoId" INTEGER,
    "itemTypeId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Photo" (
    "photoId" SERIAL NOT NULL,
    "filePath" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("photoId")
);

-- CreateTable
CREATE TABLE "ItemType" (
    "itemTypeId" SERIAL NOT NULL,

    CONSTRAINT "ItemType_pkey" PRIMARY KEY ("itemTypeId")
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
CREATE TABLE "_ItemToMeal" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToMeal_AB_unique" ON "_ItemToMeal"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToMeal_B_index" ON "_ItemToMeal"("B");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("photoId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType"("itemTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("mealId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_mealTimeId_fkey" FOREIGN KEY ("mealTimeId") REFERENCES "MealTime"("mealTimeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CupCount" ADD CONSTRAINT "CupCount_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("mealPlanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CupCount" ADD CONSTRAINT "CupCount_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToMeal" ADD CONSTRAINT "_ItemToMeal_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToMeal" ADD CONSTRAINT "_ItemToMeal_B_fkey" FOREIGN KEY ("B") REFERENCES "Meal"("mealId") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "FeedBackGiven" (
    "feedBackId" INTEGER NOT NULL,
    "residencyId" INTEGER NOT NULL,

    CONSTRAINT "FeedBackGiven_pkey" PRIMARY KEY ("residencyId","feedBackId")
);

-- AddForeignKey
ALTER TABLE "FeedBackGiven" ADD CONSTRAINT "FeedBackGiven_feedBackId_fkey" FOREIGN KEY ("feedBackId") REFERENCES "Feedback"("feedbackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedBackGiven" ADD CONSTRAINT "FeedBackGiven_residencyId_fkey" FOREIGN KEY ("residencyId") REFERENCES "Residency"("residencyId") ON DELETE RESTRICT ON UPDATE CASCADE;

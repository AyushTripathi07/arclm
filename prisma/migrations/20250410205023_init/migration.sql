-- CreateTable
CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "sources" INTEGER NOT NULL,
    "highlight" BOOLEAN NOT NULL,
    "content" TEXT,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "Notebook_pkey" PRIMARY KEY ("id")
);

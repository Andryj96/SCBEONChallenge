-- CreateEnum
CREATE TYPE "CONTENT_TYPE" AS ENUM ('MOVIE', 'SERIE');

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" "CONTENT_TYPE" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLastAction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLastAction_pkey" PRIMARY KEY ("id")
);

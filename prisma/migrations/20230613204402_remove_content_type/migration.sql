/*
  Warnings:

  - You are about to drop the column `contentType` on the `Favorite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "contentType";

-- DropEnum
DROP TYPE "CONTENT_TYPE";

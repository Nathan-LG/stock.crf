/*
  Warnings:

  - You are about to drop the column `image` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "image",
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "icon" TEXT;

/*
  Warnings:

  - You are about to drop the column `suffix` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "suffix",
ADD COLUMN     "unit" TEXT;

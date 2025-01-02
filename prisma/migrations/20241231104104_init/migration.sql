/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "description" SET DEFAULT ' ';

-- CreateIndex
CREATE UNIQUE INDEX "Class_code_key" ON "Class"("code");

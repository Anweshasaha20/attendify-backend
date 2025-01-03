-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'accepted', 'rejected', 'blocked');

-- AlterTable
ALTER TABLE "JoinRequest" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';

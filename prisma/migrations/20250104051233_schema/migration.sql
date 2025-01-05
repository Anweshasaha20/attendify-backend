-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "AttendanceEnd" TIMESTAMP(3),
ADD COLUMN     "AttendanceStart" TIMESTAMP(3),
ADD COLUMN     "AttendanceValidity" INTEGER;

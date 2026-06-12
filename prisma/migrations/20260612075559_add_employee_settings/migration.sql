/*
  Warnings:

  - You are about to drop the column `updateAt` on the `ScheduleDay` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ScheduleDay` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ScheduleDay_date_idx";

-- AlterTable
ALTER TABLE "ScheduleDay" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "EmployeeSetting" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "defaultShiftId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeSetting_employeeId_month_idx" ON "EmployeeSetting"("employeeId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSetting_employeeId_month_key" ON "EmployeeSetting"("employeeId", "month");

-- CreateIndex
CREATE INDEX "ScheduleDay_employeeId_date_idx" ON "ScheduleDay"("employeeId", "date");

-- AddForeignKey
ALTER TABLE "EmployeeSetting" ADD CONSTRAINT "EmployeeSetting_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSetting" ADD CONSTRAINT "EmployeeSetting_defaultShiftId_fkey" FOREIGN KEY ("defaultShiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

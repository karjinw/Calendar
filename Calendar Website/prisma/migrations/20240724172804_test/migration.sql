/*
  Warnings:

  - Made the column `end` on table `event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start` on table `event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `end` DATETIME(3) NOT NULL,
    MODIFY `start` DATETIME(3) NOT NULL;

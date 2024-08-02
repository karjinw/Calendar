/*
  Warnings:

  - You are about to drop the column `date` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `date`,
    ADD COLUMN `end` DATETIME(3) NULL,
    ADD COLUMN `start` DATETIME(3) NULL;

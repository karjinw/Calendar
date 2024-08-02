/*
  Warnings:

  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `date`,
    ADD COLUMN `end` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `start` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

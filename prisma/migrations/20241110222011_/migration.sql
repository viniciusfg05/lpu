/*
  Warnings:

  - You are about to drop the column `branch` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `budget_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `allocations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_entries` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `project_id` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `allocations` DROP FOREIGN KEY `allocations_budget_id_fkey`;

-- DropForeignKey
ALTER TABLE `allocations` DROP FOREIGN KEY `allocations_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_budget_id_fkey`;

-- DropForeignKey
ALTER TABLE `service_entries` DROP FOREIGN KEY `service_entries_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `service_entries` DROP FOREIGN KEY `service_entries_service_id_fkey`;

-- DropIndex
DROP INDEX `budgets_branch_key` ON `budgets`;

-- DropIndex
DROP INDEX `projects_budget_id_key` ON `projects`;

-- AlterTable
ALTER TABLE `budgets` DROP COLUMN `branch`,
    DROP COLUMN `cost`,
    DROP COLUMN `description`,
    DROP COLUMN `name`,
    ADD COLUMN `project_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `projects` DROP COLUMN `budget_id`,
    DROP COLUMN `totalCost`,
    ADD COLUMN `branch` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalValue` DOUBLE NULL;

-- DropTable
DROP TABLE `allocations`;

-- DropTable
DROP TABLE `service_entries`;

-- CreateTable
CREATE TABLE `services_per_project` (
    `id` VARCHAR(191) NOT NULL,
    `lp_id` VARCHAR(191) NOT NULL,
    `unit` DOUBLE NOT NULL,
    `type_unit` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `value_per_unit` DOUBLE NULL,
    `valueTotal` DOUBLE NULL,
    `budget_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services_per_project` ADD CONSTRAINT `services_per_project_budget_id_fkey` FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

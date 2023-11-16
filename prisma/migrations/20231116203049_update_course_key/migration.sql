/*
  Warnings:

  - The primary key for the `groups` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "groups" DROP CONSTRAINT "groups_pkey",
ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("userId", "course_id");

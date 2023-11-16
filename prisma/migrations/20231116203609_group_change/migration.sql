/*
  Warnings:

  - A unique constraint covering the columns `[userId,course_id]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "groups_userId_course_id_key" ON "groups"("userId", "course_id");

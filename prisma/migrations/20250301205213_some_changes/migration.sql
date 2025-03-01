/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ChatParticipant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Chat_passcode_key";

-- AlterTable
ALTER TABLE "ChatParticipant" DROP COLUMN "createdAt";

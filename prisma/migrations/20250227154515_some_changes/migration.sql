/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatId]` on the table `ChatParticipant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passcode` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "passcode" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChatParticipant" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "leftAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "content" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_userId_chatId_key" ON "ChatParticipant"("userId", "chatId");

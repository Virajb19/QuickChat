import { notFound, redirect } from "next/navigation"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

export default async function ChatPage({ params } : { params: Promise<{ chatId: string}>}) {

  const session = await auth()
  if(!session || !session.user) return redirect('/')
  const userId = parseInt(session.user.id)

  const {chatId} = await params

  const chat = await db.chat.findUnique({where: {id: chatId}, select: { id: true, ownerId: true}})
  if(!chat) return notFound()

  const isParticipant = await db.chatParticipant.findUnique({where: {userId_chatId: {userId,chatId}}, select: {id: true}})
  if(!isParticipant && chat.ownerId !== userId) return redirect('/chats')

  return <div className="border w-full min-h-screen pt-24">
        {chat.id}
  </div>
}
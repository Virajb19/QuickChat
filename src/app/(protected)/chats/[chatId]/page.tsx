import { notFound, redirect } from "next/navigation"
import ChatContainer from "~/components/ChatContainer"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

export default async function ChatPage({ params } : { params: Promise<{ chatId: string}>}) {

  const session = await auth()
  if(!session || !session.user) return redirect('/')
  const userId = parseInt(session.user.id)

  const {chatId} = await params

  const chat = await db.chat.findUnique({where: {id: chatId}, include: {owner: {select: {ProfilePicture: true, username: true}}}})
  if(!chat) return notFound()

  const isParticipant = await db.chatParticipant.findUnique({where: {userId_chatId: {userId,chatId}}, select: {id: true}})
  if(!isParticipant && chat.ownerId !== userId) return redirect('/chats')

  const participants = await db.chatParticipant.findMany({where: {chatId: chat.id}, include: {user: {select: {username: true, ProfilePicture: true}}}})
  // const messages = await db.message.findMany({where: {chatId: chat.id}, include: {sender: {select: {ProfilePicture: true, username: true}}}, orderBy: {createdAt: 'asc'}})

  return <ChatContainer chat={chat} participants={participants} userId={userId}/>

}
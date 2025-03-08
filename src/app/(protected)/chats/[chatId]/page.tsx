import { notFound, redirect } from "next/navigation"
import ChatSideBar from "~/components/ChatSideBar"
import MessageInput from "~/components/message/MessageInput"
import MessageList from "~/components/message/MessageList"
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

  const participants = await db.chatParticipant.findMany({where: {chatId: chat.id}, include: {user: {select: {username: true, ProfilePicture: true}}}})
  const messages = await db.message.findMany({where: {chatId: chat.id}, include: {sender: {select: {ProfilePicture: true, username: true}}}, orderBy: {createdAt: 'asc'}})

  return <div className="w-full min-h-screen flex-center">
        <div className="flex w-4/5 md:w-3/4 lg:w-1/2 max-w-5xl border-2 rounded-lg dark:bg-card bg-accent shadow-lg shadow-blue-600">
            <ChatSideBar participants={participants}/>
            <div className="flex flex-col w-4/5">
               <MessageList chatId={chat.id} userId={userId}/>
               <MessageInput chatId={chat.id} userId={userId}/>
            </div>
        </div>
  </div>
}
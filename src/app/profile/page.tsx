import { redirect } from "next/navigation"
import UserProfile from "~/components/UserProfile"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

export default async function ProfilePage() {

  const session = await auth()
  if(!session || !session?.user) return redirect('/')

  const joinedChats = await db.chatParticipant.findMany({
    where: {userId: parseInt(session.user.id)},
    include: {
      Chat: {
         select: { 
          messages: {orderBy: {createdAt: 'desc'}, take: 1}, title: true, createdAt: true,
          participants: { select: {id: true}}
        },
      }
    },
    orderBy: {joinedAt: 'desc'}
  })

  return <div className="w-full min-h-screen flex-center pt-24">
        <UserProfile session={session} joinedChats={joinedChats}/>
  </div>
}
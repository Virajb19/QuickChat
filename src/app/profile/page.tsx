import { User } from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

export default async function ProfilePage() {

  const session = await auth()
  if(!session || !session?.user) return redirect('/')

  const joinedChats = await db.chatParticipant.findMany({where: {userId: parseInt(session.user.id)}, include: {Chat: {select: {messages: true}}}})

  return <div className="w-full min-h-screen flex-center">
       <div className="flex flex-col bg-card rounded-lg border-2 w-4/5 md:w-3/4 lg:w-1/3 max-w-5xl">
           <div className="flex flex-col md:flex-row items-center gap-3 p-5">
              {session.user.image ? ( 
                <Image src={session?.user.image} alt="user" width={200} height={200} className="rounded-full"/>
              ) : (
                 <div className="p-4 size-24 rounded-full flex-center bg-gradient-to-b from-blue-400 to-blue-700">
                     <User className="size-20 "/>
                 </div>
              )}
                <div className="flex flex-col items-center">
                        <div className="flex items-center gap-3">
                            <User className=""/>
                            <p className="text-3xl font-extrabold tracking-wider">{session.user.name}</p>
                        </div>
                    </div>
           </div>
        </div>   
  </div>
}
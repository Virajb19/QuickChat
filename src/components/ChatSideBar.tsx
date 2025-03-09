'use client'

import { Chat, ChatParticipant, User } from "@prisma/client";
import { motion } from 'framer-motion'
import { ArrowLeft, LogOut } from 'lucide-react'
import { api } from "~/trpc/react";
import { useRouter } from 'nextjs-toploader/app'
import { toast } from "sonner";
import Link from "next/link";

type Props = {
    userId: number
    chat: Pick<Chat, "id" | "ownerId" | "title">,
    participants: (ChatParticipant & { user: Pick<User, "username" | "ProfilePicture"> }) []
}

const colors = ['red', 'blue', 'green', 'orange', 'purple']
const randomColor = colors[Math.floor(Math.random() * colors.length)]

export default function ChatSideBar({participants, chat, userId}: Props) {

  // const chatId = useMemo(() => participants[0]?.chatId, [participants])

  // const {data: session, status} = useSession()
  // const userId = session?.user.id

  const router = useRouter()

  const leaveChat = api.user.leaveChat.useMutation({
    onSuccess: () => {
       router.push('/')
       toast.success(`Left the chat ${chat.title}`)
    },
    onError: (err) => {
       console.error(err) 
       toast.error(err.message)
    }
  })

  return <div className="flex flex-col gap-1 w-1/4 border-r-2">
         <div className="flex items-center gap-3 p-3 border-b border-zinc-500">
             <h4 className="text-2xl capitalize font-bold truncate">{chat.title}</h4>
             <span className="text-gray-300 font-semibold text-lg">({participants.length})</span>
         </div>
        <div className="flex flex-col p-1 gap-2 h-[calc(90vh-17rem)] overflow-y-scroll border-b-2 border-zinc-400">
              {participants.map((participant, i) => {
                  const image = participant.user.ProfilePicture
                  const name = participant.user.username
                  return <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{ease: 'easeInOut', delay: 0.1 * i}}
                    key={participant.id} className="flex items-center gap-2 p-2 rounded-lg border bg-blue-600/10">
                      <div className="shrink-0 w-fit rounded-full">
                        {image ? (
                            <img src={image} className="size-10 rounded-full"/>
                        ) : (
                            <span style={{backgroundColor: randomColor}} className="size-10 uppercase font-semibold flex-center text-lg rounded-full">
                                {name.split(' ').slice(0,2).map(name => name[0]).join('')}
                            </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <strong className="text-base capitalize truncate">{name}</strong>
                        <span className="font-semibold text-xs text-gray-400">{participant.isOnline ? 'online' : 'offline'}</span>
                      </div>
                  </motion.div>
              })}
              {/* <div className="bg-red-400 w-10 h-screen shrink-0"/> */}
        </div>
         {chat.ownerId === userId ? (
           <Link href={'/chats'} className="flex-center gap-2 bg-blue-700 hover:bg-blue-600 group font-semibold py-2 rounded-lg mx-2">
               <ArrowLeft className="group-hover:-translate-x-1 duration-200"/> Go to chats
           </Link>
         ) : (
          <button onClick={() => leaveChat.mutate({chatId: chat.id})} disabled={leaveChat.isPending} className="flex-center gap-2 bg-red-700 hover:bg-red-600 tracking-wide hover:gap-4 text-lg font-semibold duration-200  rounded-lg mx-2 py-2 disabled:cursor-not-allowed disabled:opacity-70">
              {leaveChat.isPending ? (
                <>
                    <div className='size-5 border-[3px] border-white/50 border-t-white rounded-full animate-spin'/> Leaving...
                </>
              ) : (
                <>
                  Leave <LogOut className="size-5"/>
                </>
              )}
          </button>
         )}
  </div>
}
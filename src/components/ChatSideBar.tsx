'use client'

import { Chat, ChatParticipant, User } from "@prisma/client";
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, LogOut, Users } from 'lucide-react'
import { api } from "~/trpc/react";
import { useRouter } from 'nextjs-toploader/app'
import { toast } from "sonner";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { colors } from '~/lib/utils'
import { Skeleton } from "./ui/skeleton";
import { useLocalStorage } from 'usehooks-ts'
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useSocketStore } from "~/lib/store";

type Props = {
    userId: number
    chat: Chat & { owner: Pick<User, "ProfilePicture" | "username">},
    participants: (ChatParticipant & { user: Pick<User, "username" | "ProfilePicture"> }) []
}

// const randomColor = colors[Math.floor(Math.random() * colors.length)]

function getColor(id: string) {
   let color = localStorage.getItem(`${id}-color`)
   if(!color) {
     color = colors[Math.floor(Math.random() * colors.length)] as string
     localStorage.setItem(`${id}-color`, color)
   }
   return color
}

export default function ChatSideBar({participants, chat, userId}: Props) {

  // const chatId = useMemo(() => participants[0]?.chatId, [participants])

  const {data: session, status} = useSession()
  // const userId = session?.user.id

  const [showOnline, setShowOnline] = useLocalStorage('showOnlineUsers', false)

  // Import from zustand store directly useSocketStore()
  // const socket = useSocket(chat.id)
  const { socket } = useSocketStore()

  const router = useRouter()

  const {data: chatParticipants, isLoading, isError} = api.chat.getParticipants.useQuery({chatId: chat.id}, {refetchInterval: 5 * 60 * 1000})

  const filteredParticipants = useMemo(() => {
       return showOnline ? chatParticipants?.filter(p => p.isOnline) : chatParticipants
  }, [showOnline, chatParticipants])

  const owner = useMemo(() => {
     return {
        image: chat.owner.ProfilePicture,
        name: chat.owner.username
     }
  }, [chat])

  const leaveChat = api.user.leaveChat.useMutation({
    onSuccess: ({participantId}) => {
       router.push('/')
       toast.success(`Left the chat ${chat.title}`)
       socket?.emit('leave:chat', session?.user.name ?? '', participantId)
    },
    onError: (err) => {
       console.error(err) 
       toast.error(err.message)
    }
  })

  return <div className="flex flex-col gap-1 w-1/4 mb:w-full border-r-2">
        <div className="flex flex-col gap-1 items-start border-b border-zinc-500 p-3">
            <div className="flex items-center gap-3">
                <h4 className="text-2xl uppercase font-bold truncate">{chat.title}</h4>
                <span className="text-gray-300 font-semibold text-lg">({participants.length})</span>
            </div>
            <div className="flex items-center gap-2">
            <button onClick={() => setShowOnline(!showOnline)} className={twMerge("size-5 border-2 border-gray-400 rounded-sm flex-center", showOnline && 'bg-white border-transparent')}>
                   {showOnline && <Check className="text-[#1f1e20]" strokeWidth={3}/>}
               </button>
               <span className="text-base font-semibold text-gray-400">Show online</span>
            </div>
        </div>
        <div className="flex flex-col p-1 gap-2 h-[calc(90vh-19rem)] mb:h-[calc(90vh-16rem)] overflow-y-scroll border-b-2 border-zinc-400">
             {(isLoading || !filteredParticipants) ? (
                  <>
                     {Array.from({length: 5}).map((_,i) => {
                        return <Skeleton key={i} className="h-14 w-full"/>
                     })}
                  </>
             ) : filteredParticipants.length === 0 ? (
                 <div className="flex flex-col gap-2 items-center m-auto ">
                   <Users />
                   <h4 className="text-lg font-bold uppercase">Invite users</h4>
                 </div>
             ) : (
              <>
            {/* <AnimatePresence> */}
             {chat.ownerId !== userId && (
                  <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{ease: 'easeInOut', delay: 0.1}}
                  className="flex items-center gap-2 p-2 rounded-lg border bg-blue-600/10">
                    <div className="shrink-0 w-fit rounded-full">
                      {chat.owner.ProfilePicture ? (
                          <img src={chat.owner.ProfilePicture } className="size-10 rounded-full"/>
                      ) : (
                          <span style={{backgroundColor: 'blue'}} className="size-10 uppercase font-bold flex-center text-xl rounded-full">
                              {chat.owner.username.split(' ').slice(0,2).map(name => name[0]).join('')}
                          </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <strong className="text-base uppercase truncate">{owner.name}</strong>
                    </div>
                </motion.div>
             )}
                {filteredParticipants.map((participant, i) => {
                  const image = participant.user.ProfilePicture
                  const name = participant.user.username
                  const randomColor = getColor(participant.id)
                  return <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{ease: 'easeInOut', delay: 0.1 * i}}
                    key={participant.id} className="flex items-center gap-2 p-2 rounded-lg border bg-blue-600/10">
                      <div className="shrink-0 w-fit rounded-full">
                        {image ? (
                            <img src={image} className="size-10 rounded-full"/>
                        ) : (
                            <span style={{backgroundColor: randomColor}} className="size-10 uppercase font-bold flex-center text-xl rounded-full">
                                {name.split(' ').slice(0,2).map(name => name[0]).join('')}
                            </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <strong className="text-base uppercase truncate">{name}</strong>
                        <span className="font-semibold text-xs text-gray-400">{participant.isOnline ? 'online' : 'offline'}</span>
                      </div>
                  </motion.div>
                })}
              {/* </AnimatePresence> */}
               </>
             )}
              {/* <div className="bg-red-400 w-10 h-screen shrink-0"/> */}
        </div>
         {chat.ownerId === userId ? (
           <Link href={'/chats'} className="flex-center gap-2 mt-1 bg-blue-700 hover:bg-blue-600 group font-semibold py-2 rounded-lg mx-2">
               <ArrowLeft className="group-hover:-translate-x-1 duration-200"/> Go to chats
           </Link>
         ) : (
          <button onClick={() => leaveChat.mutate({chatId: chat.id})} disabled={leaveChat.isPending} className="flex-center my-1 gap-2 bg-red-700 hover:bg-red-600 tracking-wide hover:gap-4 text-lg font-semibold duration-200 border-2 border-zinc-400 rounded-md mx-2 py-1 disabled:cursor-not-allowed disabled:opacity-70">
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
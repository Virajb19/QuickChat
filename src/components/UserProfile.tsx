'use client'

import { User, Mail, ExternalLink } from "lucide-react"
import Image from "next/image"
import { motion } from 'framer-motion'
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { Chat, ChatParticipant, Message } from "@prisma/client"
import JoinButton from "./JoinButton"
import { api } from "~/trpc/react"
import LeaveButton from "./LeaveButton"
import Link from "next/link"

type Props = {
    session: Session,
    joinedChats: (ChatParticipant & { Chat: Pick<Chat, "createdAt" | "title"> & { messages: Message[], participants: Pick<ChatParticipant, "id"> []}}) []
}

export default function UserProfile({ session, joinedChats }: Props) {

    // get session data from server side
    // const {data: session, status} = useSession()

  return  <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{duration: 1, ease: 'easeInOut', type: 'spring', damping: '10'}} 
  className="flex flex-col bg-card rounded-lg border-2 w-[90%] md:w-3/4 lg:w-1/3 max-w-5xl shadow-lg shadow-blue-600 mb-10">
        <div className="flex flex-col items-center gap-3 p-5">
            <h3 className="uppercase font-bold underline">Profile</h3>
            {session.user.image ? ( 
            <Image src={session?.user.image} alt="user" width={100} height={100} className="rounded-full"/>
            ) : (
                <div className="p-4 size-24 rounded-full flex-center bg-gradient-to-b from-blue-400 to-blue-700">
                    <User className="size-20"/>
                </div>
            )}
            <div className="flex flex-col gap-5 font-semibold w-full">
                 <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2 uppercase">
                        <User className="size-6"/> Username
                     </div>
                     <div className="border-[3px] text-lg border-blue-600 bg-blue-600/20 capitalize rounded-lg p-2">
                           {session.user.name}
                     </div>
                 </div>

                 <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2 uppercase">
                        <Mail className="size-6"/> Email
                     </div>
                     <div className="border-[3px] text-lg border-blue-600 bg-blue-600/20 rounded-lg p-2">
                           {session.user.email}
                     </div>
                 </div>
             </div> 

             <h3 className="uppercase font-extrabold text-3xl mb:text-xl underline">Joined Chats</h3>
             <div className="flex flex-col gap-3 p-3 h-64 border-[3px] border-blue-600 rounded-xl overflow-y-scroll w-full">
                 {joinedChats.length === 0 ? (
                     <div className="flex-center flex-col h-full gap-2">
                         <h4 className="text-3xl font-semibold">Join a Chat!</h4>
                         <JoinButton />
                     </div>
                 ) : (
                    <>
                       {joinedChats.map(chatParticipant => {
                            const participantCount = chatParticipant.Chat.participants.length
                            return <div key={chatParticipant.id} className="border-2 border-blue-700 font-semibold rounded-lg p-2 flex flex-col gap-2">
                                 <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
                                     <h5 className="text-2xl mb:text-xl uppercase font-semibold">{chatParticipant.Chat.title}</h5>
                                     <div className="flex items-center gap-2">
                                        <Link href={`/chats/${chatParticipant.chatId}`} className="flex-center gap-2 group bg-blue-700 hover:bg-blue-600 p-2 rounded-lg font-semibold">
                                            <ExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 duration-300"/> Visit
                                        </Link>
                                        <LeaveButton username={session.user.name ?? ''} chatId={chatParticipant.chatId}/>
                                     </div>
                                 </div>
                                 <div className="flex items-center justify-between">
                                      <p>Joined At: <span className="text-lg mb:text-sm">{new Date(chatParticipant.joinedAt).toLocaleDateString()}</span></p>
                                       <p className="mb:text-sm">Total members: <span className="text-xl mb:text-sm text-blue-500">{participantCount}</span></p>
                                 </div>
                            </div>  
                       })}   
                    </>
                 )}
                 {/* <div className="bg-red-400 w-10 h-screen shrink-0"/> */}
             </div>
        </div>
</motion.div>   
}
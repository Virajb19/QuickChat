'use client'

import { api } from "~/trpc/react"
import { motion } from 'framer-motion'
import CreateChatButton from "~/components/CreateChatButton"
import ChatMenu from "~/components/ChatMenu"

export default function ChatsPage() {

  const {data: chats, isLoading, isError} = api.user.getChats.useQuery()

  if(isLoading || !chats) return <div className="">

  </div>

  if(isError) return <div className="w-full min-h-screen flex-center">
    <h1 className="text-4xl text-red-500 font-semibold">Error fetching chats!</h1>
 </div>


  return <div className="w-full min-h-screen pt-24">
       <div className="flex flex-col gap-3">
        <div className="flex items-center px-4 justify-end">
           <CreateChatButton />
        </div>
       <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 border">
             {chats.map((chat,i) => {
              return <motion.li initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.3, delay: 0.1 * i, type: 'spring', bounce: 0.5}}
               key={chat.id} className="border flex flex-col gap-4 p-3 rounded-lg overflow-hidden hover:border-blue-600 duration-200">
                   <div className="flex items-center justify-between">
                       <h2 className="text-3xl font-bold">{chat.title}</h2>
                       <ChatMenu chatId={chat.id}/>
                   </div>
                   <div className="flex flex-col items-start font-semibold">
                     <p className="truncate">Passcode:- <span className="text-xl">{chat.passcode}</span></p>
                     <p>Created At:- <span className="text-xl">{new Date(chat.createdAt).toLocaleDateString()}</span></p>
                   </div>
              </motion.li>
             })}
        </ul>
       </div>
  </div>
}
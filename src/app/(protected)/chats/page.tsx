'use client'

import { api } from "~/trpc/react"
import { motion } from 'framer-motion'
import CreateChatButton from "~/components/CreateChatButton"
import ChatMenu from "~/components/ChatMenu"
import { Skeleton } from "~/components/ui/skeleton"
import JoinButton from "~/components/JoinButton"

export default function ChatsPage() {

  const {data: chats, isLoading, isError} = api.user.getChats.useQuery()

  // if(isLoading || !chats) return <div className="">

  // </div>

  if(isError) return <div className="w-full min-h-screen flex-center">
    <h1 className="text-4xl text-red-500 font-semibold">Error fetching chats!</h1>
 </div>


  return <div className="w-full min-h-screen pt-28">
       <div className="flex flex-col gap-2">
        <div className="flex items-center px-4 justify-end gap-2">
           <JoinButton />
           <CreateChatButton />
        </div>
       <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
           {isLoading || !chats ? (
            <>
               {Array.from({length: 6}).map((_,i) => {
                  return <Skeleton className="col-span-1 h-32"/>
               })}
            </>
           ) : chats.length === 0 ? (
             <>
                <h1 className="col-span-3 text-center text-5xl font-extrabold tracking-wider">Create a chat</h1>
             </>
          ) : (
            <>
            {chats.map((chat,i) => {
              return <motion.li initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.3, delay: 0.1 * i, type: 'spring', bounce: 0.5}}
              key={chat.id} className="border-2 bg-accent dark:bg-card flex flex-col gap-4 p-3 rounded-lg overflow-hidden hover:border-blue-600 duration-200">
                  <div className="flex items-center justify-between">
                      <h2 className="text-3xl mb:text-2xl font-bold">{chat.title}</h2>
                      <ChatMenu chatId={chat.id}/>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col items-start font-semibold">
                      <p className="truncate">Passcode:- <span className="text-xl">{chat.passcode}</span></p>
                      <p>Created At:- <span className="text-xl mb:text-base">{new Date(chat.createdAt).toLocaleDateString()}</span></p>
                    </div>
                     <p className="text-lg mb:text-sm font-semibold flex items-center">Total members: <span className="font-bold text-xl ml-2 text-blue-400"> {chat.participants.length}</span></p>
                  </div>
              </motion.li>
            })}
          </>
          )}
        </ul>
       </div>
  </div>
}
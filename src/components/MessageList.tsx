'use client'

import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { api } from "~/trpc/react"
import { motion } from 'framer-motion'
import { useEffect } from 'react'

const colors = ['red', 'blue', 'green', 'orange', 'purple']
const randomColor = colors[Math.floor(Math.random() * colors.length)]

export default function MessageList({chatId, userId}: {chatId: string, userId: number}) {

  // const {data: session, status} = useSession()
  // const userId = parseInt(session?.user.id)

  const {data: messages, isLoading, isError, isRefetching, isFetching} = api.chat.getMessages.useQuery({chatId}, { refetchInterval: 3 * 60 * 1000})

  useEffect(() => {
    const messageContainer = document.getElementById('message-container')
    if(messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages]) 

  if(isLoading || !messages) return <div className="flex-center grow">
      <Loader2 className="size-12 text-blue-600 animate-spin"/>
  </div>

  // use || true to check
  // Why justify-end not working ??
  return <div id="message-container" className="flex flex-col gap-2 overflow-hidden h-[32rem]">
       <div className="flex flex-col flex-1 gap-2 overflow-auto">
       {messages.length === 0 ? (
         <h3 className="self-center my-auto font-semibold">Start messaging!</h3>
       ) : (
        <>
          {messages.map((message,i) => {
              const image = message.sender.ProfilePicture
              const name = message.sender.username
              return <div key={message.id} className={twMerge("flex items-start p-2 gap-3", message.senderId === userId && 'flex-row-reverse')}>
                    {image ? (
                      <Image src={image} alt="user" width={40} height={40} className="rounded-full"/>
                    ) : (
                      <span style={{backgroundColor: randomColor}} className="size-10 uppercase font-semibold flex-center text-2xl rounded-full bg-gradient-to-b from-green-400 to-green-700">
                         {name[0]}
                      </span>
                    )}
                    <motion.p key={i} initial={{opacity: 0, scale: 0.8}} animate={{opacity:1, scale: 1}} transition={{duration: 0.4, type: 'spring', bounce: 0.4}}
                      className="max-w-1/2 font-semibold p-2 rounded-md bg-blue-600/20">
                         {message.content}
                    </motion.p>
              </div>
          })}
        </> 
       )}
    {/* <div className="bg-red-400 w-10 h-screen shrink-0"/> */}
  </div>
  </div>
}
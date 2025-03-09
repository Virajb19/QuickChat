'use client'

import { Loader2, MessageSquare  } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { api } from "~/trpc/react"
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { formatDistanceToNow} from 'date-fns'
import MessageMenu from "./MessageMenu"

export default function MessageList({chatId, userId}: {chatId: string, userId: number}) {

   // Try to get session info server side and pass it to client
  // const {data: session, status} = useSession()
  // const userId = parseInt(session?.user.id)

  // make refetchInterval small for fast refetch
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

  // Try using isFetching or isRefetching
  if(isLoading || !messages) return <div className="flex-center grow">
      <Loader2 className="size-12 text-blue-600 animate-spin"/>
  </div>

  if(isError) return <div className="flex-center grow">
       <h3 className="text-lg font-bold text-red-600">Error fetching messages!</h3>
  </div>

  // use || true to check
  // Why justify-end not working ??
  return <div id="message-container" className="flex flex-col gap-2 overflow-y-scroll h-[32rem]">
       {/* <div className="flex flex-col flex-1 gap-2 overflow-auto"> */}
       {messages.length === 0 ? (
           <div className="flex flex-col items-center self-center my-auto w-fit">
              <span className="rounded-md p-3 bg-blue-600/20"><MessageSquare /></span>
              <h3 className="font-semibold">Start messaging!</h3>
           </div>
       ) : (
        <>
          {messages.map((message,i) => {

              const image = message.sender.ProfilePicture
              const name = message.sender.username
              const isUserMessage = message.senderId === userId

              return <div key={message.id} className={twMerge("flex items-start p-2 gap-3", isUserMessage && 'flex-row-reverse')}>
                  <MessageMenu chatId={chatId} messageId={message.id} image={image} name={name} isUserMessage={isUserMessage} content={message.content}/>
                   <div className="flex flex-col items-start gap-1">
                      <motion.p key={i} initial={{opacity: 0, scale: 0.8}} animate={{opacity:1, scale: 1}} transition={{duration: 0.4, type: 'spring', bounce: 0.4}}
                          className="max-w-1/2 break-words font-semibold text-left p-2 rounded-md bg-blue-600/20">
                            {message.content.split('\n').map(line => {
                              return <p className="whitespace-pre-line">{line}</p>
                            })}
                        </motion.p>
                        <span className="font-semibold text-xs">{formatDistanceToNow(new Date(message.createdAt), {addSuffix: true}).replace('about', '')}</span>
                   </div>
              </div>
          })}
        </> 
       )}
    {/* <div className="bg-red-400 w-10 h-screen shrink-0"/> */}
  </div>
  // </div>
}

// function MessageMenu() {

// }
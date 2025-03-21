'use client'

import ChatSideBar from "~/components/ChatSideBar"
import MessageInput from "~/components/message/MessageInput"
import MessageList from "~/components/message/MessageList"
import { Chat, User, ChatParticipant} from '@prisma/client'
import { useMediaQuery } from 'usehooks-ts'
import ChatSidebarMobile from "./ChatSidebarMobile"
import { AnimatePresence } from 'framer-motion'
import { useSidebarState } from "~/lib/store"

type Props = {
    userId: number,
    chat: Chat & { owner: Pick<User, "ProfilePicture" | "username">},
    participants: (ChatParticipant & { user: Pick<User, "username" | "ProfilePicture"> }) []
}

export default function ChatContainer({chat,participants,userId}: Props) {

    const { isSidebarOpen } = useSidebarState()

    const isSmallScreen = useMediaQuery('(max-width: 1024px)')

    if(isSmallScreen) return <div className="w-full min-h-screen pt-20">
        <div className="flex flex-col gap-4 w-full dark:bg-card bg-accent">
            <div className="h-[calc(90vh-5rem)]">
              <MessageList chatId={chat.id} userId={userId}/>
            </div>
              <MessageInput chatId={chat.id} userId={userId}/>
    </div>
    <AnimatePresence>
         {isSidebarOpen && (
             <ChatSidebarMobile chat={chat} participants={participants} userId={userId}/>          
         )}
    </AnimatePresence>
    </div>

  return <div className="w-full min-h-screen flex-center">
        <div className="flex lg:w-[60%] max-w-5xl border-2 rounded-lg dark:bg-card bg-accent shadow-xl shadow-blue-600">
                <ChatSideBar userId={userId} chat={chat} participants={participants}/>
                <div className="flex flex-col w-4/5">
                    <MessageList chatId={chat.id} userId={userId}/>
                    <MessageInput chatId={chat.id} userId={userId}/>
                </div>
        </div>
  </div>
}
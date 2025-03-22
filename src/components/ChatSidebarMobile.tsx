import ChatSideBar from './ChatSideBar'
import { Chat, ChatParticipant, User } from "@prisma/client";
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react';
import { useSidebarState } from '~/lib/store';

type Props = {
    userId: number
    chat: Chat & { owner: Pick<User, "ProfilePicture" | "username">},
    participants: (ChatParticipant & { user: Pick<User, "username" | "ProfilePicture"> }) []
}

export default function ChatSidebarMobile({chat,participants,userId}: Props) {

  const { closeSideBar } = useSidebarState()

  const sidebarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if(sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
           closeSideBar()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
    
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

  return <motion.div ref={sidebarRef} initial={{x: '-100%'}} animate={{x: 0}} exit={{x: '-100%'}} transition={{duration: 0.3, ease: 'easeInOut'}}
       className="border lg:hidden absolute left-0 right-16 top-24 bottom-8 max-w-[300px] z-[200] bg-background rounded-r-xl border-gray-700 overflow-hidden">
      <ChatSideBar chat={chat} participants={participants} userId={userId}/>
  </motion.div>
}
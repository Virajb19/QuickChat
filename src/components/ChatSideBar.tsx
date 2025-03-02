'use client'

import { ChatParticipant, User } from "@prisma/client";
import { motion } from 'framer-motion'

type Props = {
    participants: (ChatParticipant & { user: Pick<User, "username" | "ProfilePicture"> }) []
}

const colors = ['red', 'blue', 'green', 'orange', 'purple']
const randomColor = colors[Math.floor(Math.random() * colors.length)]

export default function ChatSideBar({participants}: Props) {
  return <div className="flex flex-col p-3 gap-2 border-r-2 h-[calc(90vh-10rem)] overflow-y-scroll">
        {participants.map((participant, i) => {
            const image = participant.user.ProfilePicture
            const name = participant.user.username
            return <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{ease: 'easeInOut', delay: 0.1 * i}}
              key={participant.id} className="flex items-center gap-5 p-2 rounded-lg border bg-blue-600/10">
                 {image ? (
                    <img src={image} className="size-12 rounded-full"/>
                 ) : (
                    <span style={{backgroundColor: randomColor}} className="size-12 uppercase font-semibold flex-center text-2xl rounded-full">
                        {name.split(' ').slice(0,2).map(name => name[0]).join('')}
                    </span>
                 )}
                 <strong className="text-2xl capitalize truncate">{name}</strong>
            </motion.div>
        })}
        {/* <div className="bg-red-400 w-10 h-screen shrink-0"/> */}
  </div>
}
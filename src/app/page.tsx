import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from 'lucide-react'
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import CreateChatButton from "~/components/CreateChatButton";
import JoinButton from "~/components/JoinButton";

export default async function HomePage() {

  const session = await auth()
  const isAuth = !!session?.user

  const chatCount = session?.user.id ? await db.chat.count({where: {ownerId: parseInt(session?.user.id)}}) : 0

  return <div className="w-full min-h-screen pt-28">
          <div className="flex-center flex-col gap-3">
              <h1 className="text-5xl font-extrabold text-blue-500">Instant Chat Links for Seamless Conversations</h1>
              <p className="text-xl font-semibold">QuickChat makes it effortless to create secure chat links and start
              conversations in seconds.</p>
             {isAuth ? (
                  <div className="flex items-center gap-2">
                    {chatCount > 0 ? <Link href={'/chats'} className="font-bold flex items-center gap-2 bg-blue-700 group rounded-lg px-3 py-2">Go to Chats<ArrowRight className="group-hover:translate-x-1 duration-300"/></Link> : (
                      <JoinButton />
                    )}
                    <CreateChatButton />
               </div>
             ) : (
              <Link href={'/signup'} className="flex items-center gap-3 hover:gap-4 duration-200 font-bold rounded-lg bg-blue-600 py-2 px-3">Signup to get started<ArrowRight /></Link>
             )}
              <Image alt="img" src={'/conversation.svg'} width={800} height={800} className="object-cover" unoptimized/>
          </div>
  </div>
}
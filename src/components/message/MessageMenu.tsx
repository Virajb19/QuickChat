import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import DeleteButton from "./DeleteButton";
import { Message, User } from "@prisma/client";
import EditButton from "./EditButton";

const colors = ['red', 'blue', 'green', 'orange', 'purple']
const randomColor = colors[Math.floor(Math.random() * colors.length)]

type Props = {
    image: string | null,
    name: string,
    isUserMessage: boolean
    chatId: string,
    messageId: string,
    content: string
    // message: Message & { sender: Pick<User, "username" | "ProfilePicture">},
    // userId: string
}

export default function MessageMenu({image,name,isUserMessage,chatId,messageId, content}: Props) {
  return <DropdownMenu modal={false}>
        <DropdownMenuTrigger disabled={!isUserMessage}>
               <div className="shrink-0 min-w-fit">
                {image ? (
                        <Image src={image} alt="user" width={40} height={40} className="rounded-full"/>
                      ) : (
                        <span style={{backgroundColor: randomColor}} className="size-10 p-3 uppercase font-semibold flex-center text-2xl rounded-full bg-gradient-to-b from-green-400 to-green-700">
                          {name[0]}
                        </span>
                  )}  
               </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex items-center gap-1 m-2 min-w-20 z-[99999] rounded-md bg-neutral-100 dark:bg-neutral-900 border-[3px] border-blue-500" align="end">
             <DropdownMenuItem className="p-0">
                 <DeleteButton chatId={chatId} messageId={messageId}/>
             </DropdownMenuItem>

             <DropdownMenuSeparator />

             <DropdownMenuItem onClick={e => e.preventDefault()} className="p-0">
                 <EditButton chatId={chatId} messageId={messageId} prevContent={content}/>
             </DropdownMenuItem>
        </DropdownMenuContent>
  </DropdownMenu>
}
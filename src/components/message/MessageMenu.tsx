import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import { twMerge } from "tailwind-merge";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { colors } from '~/lib/utils'

// const randomColor = colors[Math.floor(Math.random() * colors.length)]

function getColor(id: string) {
  let color = localStorage.getItem(`${id}-color`)
  if (!color) {
      color = colors[Math.floor(Math.random() * colors.length)] as string
      localStorage.setItem(`${id}-color`, color)
  }
  return color
}

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

  const avatar = (
    <div className={twMerge("shrink-0 min-w-fit", isUserMessage && 'cursor-pointer')}>
        {image ? (
            <Image src={image} alt="user" width={40} height={40} className="rounded-full"/>
          ) : (
            <span style={{backgroundColor: getColor(name)}} className="size-10 p-3 uppercase font-semibold flex-center text-2xl rounded-full">
              {name[0]}
            </span>
        )}  
    </div>
  )

  return <DropdownMenu modal={false}>
           {isUserMessage ? (
               <DropdownMenuTrigger disabled={!isUserMessage} asChild>
                  {avatar}
               </DropdownMenuTrigger>
           ) : (
                <Tooltip>
                    <TooltipTrigger disabled={isUserMessage} className="shrink-0">
                        {avatar}
                    </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={10} className="border-[3px] rounded-sm text-lg text-black dark:text-white font-semibold border-blue-600 bg-neutral-100 dark:bg-neutral-900">
                            {name}
                      </TooltipContent>
              </Tooltip>
           )}
        <DropdownMenuContent className="flex items-center gap-1 m-2 min-w-20 z-[99999] rounded-md bg-neutral-100 dark:bg-neutral-900 border-[3px] border-blue-500" align="end">
             <DropdownMenuItem className="p-0">
                 <DeleteButton chatId={chatId} messageId={messageId}/>
             </DropdownMenuItem>

             <DropdownMenuSeparator />

             <DropdownMenuItem onSelect={e => e.preventDefault()} className="p-0">
                 <EditButton chatId={chatId} messageId={messageId} prevContent={content}/>
             </DropdownMenuItem>
        </DropdownMenuContent>
  </DropdownMenu>
}
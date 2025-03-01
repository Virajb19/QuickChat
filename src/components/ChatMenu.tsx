import { Check, Copy, EllipsisVertical, ExternalLink } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu"
import DeleteButton from './DeleteButton';
import { useState } from 'react';
import { useRouter } from 'nextjs-toploader/app'
import { useCopyToClipboard } from 'usehooks-ts'
import { twMerge } from 'tailwind-merge';

export default function ChatMenu({chatId} : {chatId: string}) {

  // const utils = api.useUtils()
  // const isMutating = utils.user.deleteChat.isMutating()

  const router = useRouter()
  const [copiedText, copy] = useCopyToClipboard()
  const [isCopied, setIsCopied] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)

  return <DropdownMenu modal={false}>
       <DropdownMenuTrigger disabled={isDeleting}>
           {isDeleting ? (
               <div className="size-5 border-[3px] border-red-400/30 border-t-red-500 rounded-full animate-spin" />           
              ) : (
                <div className='p-2 rounded-full hover:bg-blue-500/20 duration-300'>
                  <EllipsisVertical />
                </div>
           )}
       </DropdownMenuTrigger>
       <DropdownMenuContent align='end' className='m-2 min-w-44 z-[99999] rounded-md bg-neutral-100 dark:bg-neutral-900 border-[3px] border-blue-500'>
         
         <DropdownMenuItem onClick={(e) => {
            e.preventDefault()
            copy(chatId)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2500)
         }} className='cursor-pointer p-0'>
             <div className={twMerge('flex items-center gap-3 p-2 rounded-md w-full text-base font-semibold hover:bg-blue-600/40', isCopied && 'hover:bg-green-600')}>
                {isCopied ? (
                  <>
                     <Check /> Copied
                  </>
                ) : (
                  <>
                    <Copy /> Copy ID
                  </>
                )}
             </div>
         </DropdownMenuItem>

         <DropdownMenuSeparator />

         <DropdownMenuItem onClick={() => router.push(`/chats/${chatId}`)} className='cursor-pointer p-0'>
             <div className='flex items-center gap-3 p-2 rounded-md w-full text-base font-semibold'>
                  <ExternalLink /> Visit Chat
             </div>
         </DropdownMenuItem>

         <DropdownMenuSeparator />

          <DropdownMenuItem className='focus:bg-transparent p-0'>
              <DeleteButton chatId={chatId} setIsDeleting={setIsDeleting}/>
          </DropdownMenuItem>
       </DropdownMenuContent>
  </DropdownMenu>
}
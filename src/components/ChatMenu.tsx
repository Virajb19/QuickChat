import { EllipsisVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu"
import DeleteButton from './DeleteButton';
import { useState } from 'react';
import { api } from '~/trpc/react';

export default function ChatMenu({chatId} : {chatId: string}) {

  // const utils = api.useUtils()
  // const isMutating = utils.user.deleteChat.isMutating()

  const [isDeleting, setIsDeleting] = useState(false)

  return <DropdownMenu modal={false}>
       <DropdownMenuTrigger disabled={isDeleting}>
           {isDeleting ? (
               <div className="size-5 border-[3px] border-red-400/30 border-t-red-500 rounded-full animate-spin" />           
              ) : (
             <EllipsisVertical />
           )}
       </DropdownMenuTrigger>
       <DropdownMenuContent align='end' className='m-2 min-w-44 z-[99999] rounded-md bg-neutral-100 dark:bg-neutral-900 border-2 border-blue-500'>
         
         <DropdownMenuSeparator />

          <DropdownMenuItem className='focus:bg-transparent p-0'>
              <DeleteButton chatId={chatId} setIsDeleting={setIsDeleting}/>
          </DropdownMenuItem>
       </DropdownMenuContent>
  </DropdownMenu>
}
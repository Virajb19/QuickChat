'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu"
import { api } from "~/trpc/react";
import { LogOut, Home, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import UserAvatar from './UserAvatar';
import Link from "next/link";
import { toast } from "sonner";
import { useSocketStore } from "~/lib/store";

export default function UserAccountNav() {

       const utils = api.useUtils()
  // WE WILL HAVE TO USE SOCKET HERE
       const { socket } = useSocketStore()

       const updateStatus = api.user.updateStatus.useMutation({
        onSuccess: ({chatIds, userId}) => {
            // await Promise.all(chatIds.map(async chatId => {
            //      utils.chat.getParticipants.refetch({chatId})
            // }))
            socket?.emit('user:statusChange', chatIds, userId)
        }, 
        onError: (err) => {
            console.error(err)
            toast.error(err.message)
        }
    })

//    const updateStatus = useMutation({
//      mutationFn: async (status: boolean) => {
//          const res = await axios.put('/api/updateStatus', { status })
//          return res.data
//      },
//      onError: (err) => {
//         console.error(err)
//      }
//    })

    const {data: session} = useSession()
    const user = session?.user

    return <main className="mb:text-xs">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                        <UserAvatar />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='m-2 min-w-44 z-[99999] rounded-md bg-neutral-100 dark:bg-neutral-900 border-[3px] border-blue-500' align='center'> 
                     <DropdownMenuItem>
                        <div className='flex flex-col font-semibold'>
                            {user?.name && <p className='text-lg'>{user.name}</p>}
                            {user?.email && <p className='text-sm text-zinc-500 truncate'>{user.email}</p>}
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                    <Link href={'/profile'} className="flex items-center gap-2 text-base font-bold transition-all duration-300 hover:text-blue-500">
                            <User className="size-4" strokeWidth={3}/> Profile
                         </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                         <Link href={'/'} className="flex items-center gap-2 text-base font-bold transition-all duration-300 hover:text-blue-500">
                            <Home className="size-4" strokeWidth={3}/> Home
                         </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* disabled={updateStatus.isPending} */}
                    <DropdownMenuItem className='outline-none cursor-pointer' onClick={async () => {
                        // do not wait this might delay signOut
                        // await updateStatus.mutateAsync({status: false})
                        updateStatus.mutate({status: false})
                        signOut({callbackUrl: '/'})
                    }}>
                       <span className='flex items-center gap-2 text-base font-bold transition-all duration-300 hover:text-red-500'><LogOut className='size-4' strokeWidth={3}/>Log out </span>
                       </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
        </main>
}
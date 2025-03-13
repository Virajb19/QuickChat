import { LogOut } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "nextjs-toploader/app"
import { toast } from "sonner"
import { useSocketStore } from "~/lib/store"
import { api } from "~/trpc/react"

export default function LeaveButton({chatId, username}: {chatId: string, username: string}) {

    // Import from zustand store directly useSocketStore()

     const { socket } = useSocketStore()
    // const {data: session} = useSession()
    const router = useRouter()
    // const utils = api.useUtils()

    const leaveChat = api.user.leaveChat.useMutation({
        onSuccess: ({participantId, title}) => {
           toast.success(`Left the chat ${title}`)
           socket?.emit('leave:chat', username, participantId)
           socket?.disconnect()
        },
        onError: (err) => {
           console.error(err) 
           toast.error(err.message)
        },
        onSettled: () => {
           router.refresh()
          //  utils.user.getJoinedChats.refetch()
        }
      })
    

return <button onClick={() => leaveChat.mutate({chatId})} disabled={leaveChat.isPending} className="flex-center gap-2 group bg-red-700 hover:bg-red-600 p-2 rounded-lg font-semibold">
          {leaveChat.isPending ? (
                <>
                    <div className='size-5 border-[3px] border-white/50 border-t-white rounded-full animate-spin'/> Leaving...
                </>
              ) : (
                <>
                  Leave <LogOut className="size-5 group-hover:translate-x-1 duration-200"/>
                </>
         )}
  </button>
}
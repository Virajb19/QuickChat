import {Trash} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useSocket } from '~/hooks/useSocket'
import { useSocketStore } from '~/lib/store'
import { api } from '~/trpc/react'

type Props = {
  chatId: string,
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeleteButton({chatId, setIsDeleting}: Props) {

  // use socket from useSocket why ???
  // const { socket } = useSocketStore()
  const socket = useSocket(chatId)

  const {data: session} = useSession()
 
  const utils = api.useUtils()
  const deleteChat = api.user.deleteChat.useMutation({
    onMutate: () => setIsDeleting(true),
    onSuccess: () => {
      toast.success('Deleted', { position: 'bottom-right'})
      // if(!socket) return toast.error('Socket not connected')
      socket?.emit('delete:chat', session?.user.name)
    },
    onError: (err) => {
      console.error(err)
      toast.error(err.message)
    },
    onSettled: () => {
      setIsDeleting(false)
      utils.user.getChats.refetch()
    }
  })

  return <button onClick={() => deleteChat.mutate({chatId})} disabled={deleteChat.isPending} className="flex text-base font-semibold items-center gap-3 p-2 rounded-sm hover:bg-red-500/10 hover:text-red-500 duration-300 w-full disabled:cursor-not-allowed">
          <Trash /> Delete
  </button>
}
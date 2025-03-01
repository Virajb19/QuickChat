import {Trash} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '~/trpc/react'

type Props = {
  chatId: string,
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeleteButton({chatId, setIsDeleting}: Props) {
 
  const utils = api.useUtils()
  const deleteChat = api.user.deleteChat.useMutation({
    onMutate: () => setIsDeleting(true),
    onSuccess: () => toast.success('Deleted', { position: 'bottom-right'}),
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
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useChat } from "~/hooks/useChat";
import { api } from "~/trpc/react";

export default function DeleteButton({messageId,chatId}: {messageId: string,chatId: string}) {

  const utils = api.useUtils()
  const { socket } = useChat(chatId)

  const deleteMessage = api.user.deleteMessage.useMutation({
    onMutate: async () => {
        await utils.chat.getMessages.cancel({chatId})
        const prevMessages = utils.chat.getMessages.getData({chatId})

        utils.chat.getMessages.setData({chatId}, (messages) => {
            return messages?.filter(msg => msg.id !== messageId)
        })

        return prevMessages
    },
    onSuccess: () => {
      toast.success('Deleted')
      socket.emit('delete:message', messageId)
    },
    onError: (err, {messageId}, prevMessages) => {
       console.error(err)
       toast.error(err.message)
       if(prevMessages) utils.chat.getMessages.setData({chatId}, prevMessages)
    },
    onSettled: () => {
        utils.chat.getMessages.invalidate({chatId})
    }
  })

  return <button onClick={() => deleteMessage.mutate({messageId})} disabled={deleteMessage.isPending} className="p-2 rounded-md hover:text-red-500 hover:bg-red-600/15 duration-200">
        <Trash className="size-5"/>
  </button>
} 
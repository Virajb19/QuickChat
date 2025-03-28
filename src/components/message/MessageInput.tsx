'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage} from '~/components/ui/form'
import { createMessageSchema } from '~/lib/zod'
import { Loader, SendHorizonal } from 'lucide-react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { useSocket } from '~/hooks/useSocket'
 
type Input = z.infer<typeof createMessageSchema>

export default function MessageInput({chatId, userId}: {chatId: string, userId: number}) {

    // const { socket, initSocket} = useSocketStore()
    const socket = useSocket(chatId)

    const utils = api.useUtils()
    const createMessage = api.user.createMessage.useMutation({
        onSuccess: (message) => {
           socket?.emit('send:message', message)
        },
        onError: (err) => {
            console.error(err)
            toast.error('Something went wrong')
        },
        onSettled: () => {
            utils.chat.getMessages.refetch({chatId})
            form.reset()
        }
    })

    const form = useForm<Input>({
        resolver: zodResolver(createMessageSchema),
        defaultValues: { content: ''}
    })

    async function onSubmit(data: Input) {
        if(data.content.length > 10000) {
            toast.error('Message is too long. Please keep it under 10,000 characters.', {position: 'bottom-right'})
            return
        }
        await createMessage.mutateAsync({...data,chatId})
        // socket.emit('message', data.content)
        // form.reset()
    }

    useEffect(() => {
        const button = document.getElementById('submit') as HTMLButtonElement
        const handleKeyDown = (e: KeyboardEvent) => {
          if(e.ctrlKey && e.key === 'Enter') {
             e.preventDefault()
             button.click()
          }
        }
   
        document.addEventListener('keydown', handleKeyDown)
   
        return () => document.removeEventListener('keydown', handleKeyDown)
      }, [])

  return <div className="p-1 border-t">
        <Form {...form}>
            <form className='flex items-center gap-2 p-2' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                 control={form.control}
                 name='content'
                 render={({ field }) => (
                    <FormItem className='flex flex-col gap-1 grow'>
                     <FormControl>
                       <textarea maxLength={10000} className='outline-none h-10 resize-none dark:bg-black px-3 py-1 placeholder:text-lg placeholder:font-semibold rounded-md focus:outline-none border focus:border-transparent focus:ring-[3px] focus:ring-blue-600 duration-200' placeholder='Enter chat title' {...field}/>
                     </FormControl>
                     {/* <FormMessage /> */}
                    </FormItem>
                 )}         
              />

              <motion.button whileTap={{scale: 0.9}} id='submit' disabled={form.formState.isSubmitting} type='submit' className='p-2 group flex-center rounded-xl bg-blue-600'>
                {form.formState.isSubmitting ? (
                    <Loader className='animate-spin'/>
                ) : (
                   <SendHorizonal className='group-hover:translate-x-1 duration-200'/>
                )}
              </motion.button>
            </form>
        </Form>
  </div>
}
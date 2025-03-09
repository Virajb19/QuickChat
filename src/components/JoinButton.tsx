'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle,DialogDescription } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { MessageCircle } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinChatSchema } from "~/lib/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import {useRouter} from 'nextjs-toploader/app'
import { toast } from "sonner";
import { useChat } from "~/hooks/useChat";
import { useSession } from "next-auth/react";

type Input = z.infer<typeof joinChatSchema>

export default function JoinButton() {

  const router = useRouter()
  const [open, setOpen] = useState(false)

  const {data: session, status} = useSession()
  
  const utils = api.useUtils()

  const joinChat = api.user.joinChat.useMutation({
    onSuccess: ({chatId}) => {
        setOpen(false)
        router.push(`/chats/${chatId}`)
        router.refresh()
        toast.success('Joined')
        socket.emit('join:chat', session?.user.name)
     },
     onError: (err) => {
       console.error(err)
       toast.error(err.message)
     },
     onSettled: () => {
        utils.user.getChats.refetch()
     }
  })

  const form = useForm<Input>({
    resolver: zodResolver(joinChatSchema),
    defaultValues: { chatId: '', passcode: ''}
})

 const { socket } = useChat(form.getValues('chatId'))

async function onSubmit(data: Input) {
    await joinChat.mutateAsync(data)
}

  return <Dialog open={open} onOpenChange={state => setOpen(state)}>
      <DialogTrigger>
          <button className="px-3 py-2 rounded-lg flex items-center gap-2 group font-bold bg-blue-600">
             <MessageCircle className="group-hover:rotate-12 duration-200"/> Join a Chat
          </button>
      </DialogTrigger>
      <DialogContent className="shadow-lg shadow-blue-600">
          <DialogTitle className="text-center text-3xl uppercase font-semibold">join a chat</DialogTitle>
          <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                                
                        <FormField
                          control={form.control}
                          name='chatId'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel className="text-xl font-bold">Title</FormLabel>
                              <FormControl>
                                <input className='outline-none dark:bg-black px-4 py-3 placeholder:text-lg placeholder:font-semibold rounded-md focus:outline-none border focus:border-transparent focus:ring-[3px] focus:ring-blue-600 duration-200' placeholder='Enter chat ID' {...field}/>
                              </FormControl>
                              <FormMessage />
                             </FormItem>
                          )}
                        />

                      <FormField
                          control={form.control}
                          name='passcode'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel className="text-xl font-bold">Passcode</FormLabel>
                              <FormControl>
                                <input {...field} className='outline-none dark:bg-black px-4 py-3 placeholder:text-lg placeholder:font-semibold rounded-md focus:outline-none border focus:border-transparent focus:ring-[3px] focus:ring-blue-600 duration-200' placeholder='Enter passcode of the chat'/>
                              </FormControl>
                              <FormMessage />
                             </FormItem>
                          )}
                        />

                        <button disabled={form.formState.isSubmitting} type="submit" className="flex-center gap-2 w-full bg-blue-700 hover:bg-blue-600 duration-200 rounded-lg py-2 px-5 text-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed">
                              {form.formState.isSubmitting ? (
                                <>
                                  <div className='size-5 border-[3px] border-white/50 border-t-white rounded-full animate-spin'/> Joining...
                                </>
                              ) : (
                                'Join'
                              )}
                          </button>
                    </form>
            </Form>  
      </DialogContent>
  </Dialog>
}
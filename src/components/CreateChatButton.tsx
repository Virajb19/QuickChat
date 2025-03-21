'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { createChatSchema } from "~/lib/zod";
import { z } from 'zod'
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

type Input = z.infer<typeof createChatSchema>

export default function CreateChatButton() {

    const [open, setOpen] = useState(false)
    const router = useRouter()

    const utils = api.useUtils()
    const createChat = api.user.createChat.useMutation({
      onSuccess: ({chatId}) => {
         setOpen(false)
         router.push(`/chats/${chatId}`)
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
        resolver: zodResolver(createChatSchema),
        defaultValues: { title: '', passcode: ''}
    })

    // const [isPasscodeAvailable, setIsPasscodeAvailable] = useState<boolean | null>(null)
    // const [passcode, setPasscode] = useState<string>('')
    // const debounced = useDebounceCallback(setPasscode, 400)

    // const {data: available, isFetching} = api.user.checkPasscodeAvailability.useQuery({passcode}, {enabled: passcode.length === 6})
    
    // useEffect(() => {
    //   if (passcode.length === 6) {
    //     setIsPasscodeAvailable(available ?? false)
    //   } else {
    //     setIsPasscodeAvailable(null)
    //   }
    // }, [passcode, available])

    async function onSubmit(data: Input) {
      await createChat.mutateAsync(data)
      
    }

    form.watch()

  return <Dialog open={open} onOpenChange={state => setOpen(state)}>
        <DialogTrigger>
             <button className="font-bold bg-black text-white dark:bg-white dark:text-black px-3 py-2 rounded-lg flex items-center gap-2 group mb:text-sm">
                <Plus className="group-hover:scale-110 duration-200 mb:size-5"/>Create a chat
             </button>
        </DialogTrigger>
        <DialogContent className="shadow-lg shadow-blue-600">
            <DialogTitle className="text-center text-3xl uppercase font-semibold">Create a Chat</DialogTitle>  
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                                
                        <FormField
                          control={form.control}
                          name='title'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel className="text-xl font-bold">Title</FormLabel>
                              <FormControl>
                                <input className='outline-none dark:bg-black px-4 py-3 placeholder:text-lg placeholder:font-semibold rounded-md focus:outline-none border focus:border-transparent focus:ring-[3px] focus:ring-blue-600 duration-200' placeholder='Enter chat title' {...field}/>
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
                             {/* {passcode.length === 6 && (
                                 <div className={twMerge("flex items-center gap-1 text-sm font-medium", isFetching ? 'text-gray-400' :  isPasscodeAvailable ? 'text-green-500' : 'text-red-500')}>
                                 {isFetching ? (
                                     <>
                                       <Loader className="animate-spin size-4"/>  Checking...
                                     </>
                                   ) : isPasscodeAvailable ?  (
                                     <>
                                       <CheckCheck className="size-4"/> Available
                                     </>
                                   ) : (
                                     <>
                                       <CircleAlert className="size-4"/> Not available
                                     </>
                                 )}
                               </div>
                             )} */}
                              <FormMessage />
                             </FormItem>
                          )}
                        />
                           {/* || isFetching || isPasscodeAvailable === false */}
                        <button disabled={form.formState.isSubmitting} type="submit" className="flex-center gap-2 w-full bg-blue-700 hover:bg-blue-600 duration-200 rounded-lg py-2 px-5 text-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed">
                              {form.formState.isSubmitting ? (
                                <>
                                  <div className='size-5 border-[3px] border-white/50 border-t-white rounded-full animate-spin'/> Creating...
                                </>
                              ) : (
                                'Create'
                              )}
                          </button>
                    </form>
            </Form>  
        </DialogContent>
</Dialog>

}
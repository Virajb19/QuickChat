import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle,DialogDescription } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { editMessageSchema } from "~/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";

type Input = z.infer<typeof editMessageSchema>

export default function EditButton({messageId, chatId, prevContent}: {messageId: string, chatId: string, prevContent: string}) {

    const [open, setOpen] = useState(false)
    const utils = api.useUtils()

  const editMessage = api.user.editMessage.useMutation({
     onSuccess: () => {
        setOpen(false)
        toast.success('Edited')
     },
     onError: (err) => {
        console.error(err)
        toast.error(err.message)
     },
     onSettled: () => {
        utils.chat.getMessages.refetch({chatId})
     }
  })

  const form = useForm<Input>({
      resolver: zodResolver(editMessageSchema),
      defaultValues: { newContent: prevContent}
  })

  async function onSubmit(data: Input) {
    // toast.success('Submitted')
    await editMessage.mutateAsync({...data,messageId})
  }

  return <Dialog open={open} onOpenChange={state => setOpen(state)}>
      <DialogTrigger>
            <button className="p-2 rounded-md hover:text-blue-500 hover:bg-blue-600/15 duration-200">
                <Pencil className="size-5"/>
        </button>
      </DialogTrigger>
      <DialogContent className="shadow-lg shadow-blue-600">
         <DialogTitle className="text-center text-3xl uppercase font-semibold">Edit Message</DialogTitle>
         <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                 control={form.control}
                 name='newContent'
                 render={({ field, fieldState, formState }) => (
                    <FormItem className='flex flex-col gap-1 grow'>
                     <FormControl>
                       <textarea className={twMerge('outline-none w-full block h-40 resize-none dark:bg-black px-3 py-1 placeholder:text-lg placeholder:font-semibold rounded-md focus:outline-none border focus:border-transparent focus:ring-[3px] focus:ring-blue-600 duration-200', fieldState.error && 'focus:ring-red-600')} placeholder='Enter chat title' {...field}/>
                     </FormControl>
                     <FormMessage />
                    </FormItem>
                 )}         
              />
            </form>

            <button disabled={form.formState.isSubmitting} type="submit" className="flex-center gap-2 w-full bg-blue-700 hover:bg-blue-600 duration-200 rounded-lg py-2 px-5 text-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed">
               {form.formState.isSubmitting ? (
                    <>
                      <div className='size-5 border-[3px] border-white/50 border-t-white rounded-full animate-spin'/> Editing...
                    </>
                  ) : (
                    'Edit'
                )}
            </button>
         </Form>
      </DialogContent>
  </Dialog>
}
'use client'

import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { FaGithub} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { api } from '~/trpc/react';
import { useSocketStore } from '~/lib/store';

export const DemarcationLine = () => (
    <div className="flex items-center my-4">
      <div className="flex-grow h-px bg-gray-300" />
      <span className="px-4 text-sm text-gray-500">or continue with</span>
      <div className="flex-grow h-px bg-gray-300" />
    </div>
  )

type Props = {
  label: string,
  provider: string,
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function OAuthButton({label, provider, loading, setLoading}: Props) {

    // const [loading,setLoading] = useState(false)

    const { socket } = useSocketStore()

    const updateStatus = api.user.updateStatus.useMutation({
      onSuccess: ({chatIds,userId}) => {
        socket?.emit('user:statusChange', chatIds, userId)
      },
      onError: (err) => {
         console.error(err)
         toast.error(err.message)
      }
    })
  
    
  return (
    <motion.button
      onClick={async () => {
        try {
          setLoading(true)
          const result = await signIn(provider, { callbackUrl: "/" });
          if(result?.error) {
             throw new Error(result.error)
          }
          // toast.success("Signed in successfully");
          setTimeout(() => {
             updateStatus.mutate({status: true})
          }, 5000)
        } catch (error) {
          toast.error("Something went wrong !!!");
          setLoading(false)
        }
      }}
      disabled={loading}
      className={twMerge("flex-center gap-4 w-full sm:w-fit mx-auto rounded-xl px-4 py-2 mb-2 text-base border-[3px] dark:border-transparent disabled:cursor-not-allowed disabled:opacity-60",
        provider === 'github' ? 'bg-white/20 font-semibold' : 'bg-white text-black font-semibold'
      )}
    >
       {label}
       {provider === 'github' ? <FaGithub className='size-8'/> : <FcGoogle className='size-8'/>}

    </motion.button>
  )
}
  
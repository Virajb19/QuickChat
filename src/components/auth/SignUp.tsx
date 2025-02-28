'use client'

import { useRouter } from 'nextjs-toploader/app'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema } from '~/lib/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Loader, CircleAlert, CheckCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { DemarcationLine, OAuthButton } from './social-auth'
import PasswordInput from './PasswordInput'
import Link from 'next/link'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { twMerge } from 'tailwind-merge'

type SignUpData = z.infer<typeof SignUpSchema>

export default function SignUp() {
 
  const utils = api.useUtils()
  const signup = api.user.signup.useMutation()

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [username, setUsername] = useState('')
  const debounced = useDebounceCallback(setUsername, 500)
  const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | 'checking' | null>(null)

  const {data: available, isFetching} = api.user.checkUsername.useQuery({username}, { enabled: username.length >= 3 && username.length <= 10})

  useEffect(() => {
     if(username.length >= 3 && username.length <= 10) {
       setUsernameStatus(available ? 'available' : 'taken')
     } else setUsernameStatus(null)
  }, [available])

  const form = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { username: '', email: '', password: ''}
  })

  async function onSubmit(data: SignUpData) {
    await signup.mutateAsync(data, {
        onSuccess: () => {
            toast.success('Signed up')
            router.push('/signin')
        },
        onError: (err) => {
            console.error(err)
            toast.error(err.message)
        }
      })
  }

  return <div className="w-full min-h-screen pt-24 pb-5 flex-center text-lg">

    <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{duration: 0.7, ease: 'easeInOut', type: 'spring', damping: '10'}} 
    className='w-[90%] sm:w-1/3 max-w-3xl z-30'>
              <Card className='shadow-lg shadow-blue-700'>
                <CardHeader className='text-center'>
                   <CardTitle className='text-[1.8rem] sm:text-5xl'>
                    Welcome to <span className='bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text pr-1 font-black tracking-tighter text-transparent'>QuickChat</span>
                    </CardTitle>
                   <CardDescription className='sm:text-base'>Please enter your details to signup</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                        <form className='space-y-3 w-full' onSubmit={form.handleSubmit(onSubmit)}>

                        <FormField
                          control={form.control}
                          name='username'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <input onChange={e => {
                                  field.onChange(e)
                                  debounced(e.target.value)
                                }} className='input-style' placeholder='Enter your username'/>
                              </FormControl>
                               {username.length >= 3 && username.length <= 10 && (
                                     <div className={twMerge("flex items-center gap-1 text-sm font-medium", isFetching ? 'text-gray-400' :  usernameStatus === 'available' ? 'text-green-500' : 'text-red-500')}>
                                     {isFetching ? (
                                           <>
                                             <Loader className="animate-spin size-4"/>  Checking...
                                           </>
                                         ) : usernameStatus === 'available' ?  (
                                           <>
                                             <CheckCheck className="size-4"/> username available
                                           </>
                                         ) : (
                                           <>
                                             <CircleAlert className="size-4"/> username already taken
                                           </>
                                       )}
                                 </div>
                               )}
                              <FormMessage />
                             </FormItem>
                          )}
                        />
                           
                        <FormField
                          control={form.control}
                          name='email'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <input className='input-style' placeholder='name@gmail.com' {...field}/>
                              </FormControl>
                              <FormMessage />
                             </FormItem>
                          )}
                        />

                       <FormField
                          control={form.control}
                          name='password'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <PasswordInput placeholder='password' field={field}/>
                              </FormControl>
                              <FormMessage />
                             </FormItem>
                          )}
                        />

                        <motion.button whileHover={form.formState.isSubmitting && usernameStatus === 'available' ? {opacity: 0.5} : {opacity: 0.7}}
                          className='mx-auto rounded-full font-semibold cursor-pointer flex items-center gap-2 w-full flex-center px-6 py-1 text-lg bg-black text-white dark:bg-white dark:text-black disabled:cursor-not-allowed disabled:opacity-75'
                          disabled={form.formState.isSubmitting || usernameStatus === 'taken'} type='submit'> 
                         {form.formState.isSubmitting && <Loader className='animate-spin'/>} {form.formState.isSubmitting ? 'Please wait...' : 'Sign up'}
                        </motion.button>

                        <DemarcationLine />
                        <div className='flex mb:flex-col items-center gap-1'>
                        <OAuthButton label='Sign up with Github' provider='github' loading={loading} setLoading={setLoading}/>
                        <OAuthButton label='Sign up with Google' provider='google' loading={loading} setLoading={setLoading}/>
                          </div>

                        </form>
                     </Form>

                     <div className="flex items-center justify-center mt-2 text-sm sm:text-lg">
                        <span className="text-muted-foreground">
                          Already have an account?{' '}
                          <Link
                            href={'/signin'}
                            className="text-blue-500 font-semibold hover:underline"
                          >
                            Sign In
                          </Link>
                        </span>
                      </div>
                </CardContent>
              </Card>
          </motion.div>
  </div>
} 
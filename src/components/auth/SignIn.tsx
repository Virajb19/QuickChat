'use client'

import { useRouter } from 'nextjs-toploader/app'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInSchema } from '~/lib/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { DemarcationLine, OAuthButton } from './social-auth'
import PasswordInput from './PasswordInput'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { useState } from 'react'
import { api } from '~/trpc/react'
import { useSocketStore } from '~/lib/store'

type SignInData = z.infer<typeof SignInSchema>

export default function SignIn() {

  const router = useRouter()

  // shared loading state for OAuth buttons
  const [loading, setLoading] = useState(false)

  const { socket } = useSocketStore()

  const updateStatus = api.user.updateStatus.useMutation({
      onSuccess: ({chatIds, userId}) => {
      // if(!socket) return toast.error('Socket not connected')
      socket?.emit('user:statusChange', chatIds, userId)
    },
    onError: (err) => {
       console.error(err)
       toast.error(err.message)
    }
  })

  const form = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: '', password: ''}
  })

  async function onSubmit(data: SignInData) {
    
    setLoading(true)
    const res = await signIn('credentials',{...data, redirect: false})
    setLoading(false)
    
    if(res?.error) {
       const error = ['User not found. Please check your email !', 'Incorrect password. Try again !!!'].includes(res?.error ?? '') ? res?.error : 'Invalid credentials!!!'
       return toast.error(error)
    }
    form.reset()
    router.push('/')
    router.refresh()
    toast.success('Login successfull!. Welcome back!')
    updateStatus.mutate({status: true})
  }

  return <div className="w-full min-h-screen flex-center pt-20 text-lg">

    <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{duration: 0.7, ease: 'easeInOut', type: 'spring', damping: '10'}} 
    className='w-[90%] sm:w-3/4 xl:w-1/3 max-w-3xl z-30'>
              <Card className='shadow-lg shadow-blue-700'>
                <CardHeader className='text-center'>
                   <CardTitle className='text-4xl sm:text-5xl'>Welcome Back</CardTitle>
                   <CardDescription className='sm:text-base'>Please enter your details to signin</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                        <form className='space-y-3 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                           
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

                        <motion.button whileHover={form.formState.isSubmitting ? {opacity: 0.5} : {opacity: 0.8}} 
                          className='rounded-full font-bold cursor-pointer flex-center gap-2 w-full px-5 py-1 text-lg bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={form.formState.isSubmitting || loading} type='submit'> 
                         {form.formState.isSubmitting && <Loader className='animate-spin'/>} {form.formState.isSubmitting ? 'Please wait...' : 'Login'}
                        </motion.button>

                        <DemarcationLine />
                        <div className='flex mb:flex-col items-center gap-1'>
                        <OAuthButton label='Sign in with Github' provider='github' loading={loading} setLoading={setLoading}/>
                        <OAuthButton label='Sign in with Google' provider='google' loading={loading} setLoading={setLoading}/>
                          </div>

                        </form>
                     </Form>

                     <div className="flex items-center justify-center mt-6 text-sm sm:text-lg">
                        <span className="text-muted-foreground">
                          Don&apos;t have an account yet?{' '}
                          <Link
                            href={'/signup'}
                            className="text-blue-500 font-semibold hover:underline"
                          >
                            Sign Up
                          </Link>
                        </span>
                      </div>
                </CardContent>
              </Card>
          </motion.div>
  </div>
} 
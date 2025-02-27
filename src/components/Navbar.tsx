'use client'

import { Loader2, LogIn, MessagesSquare } from 'lucide-react';
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';
import UserAccountNav from './UserAccountNav';
import Link from 'next/link';

export default function Navbar() {

    const { data: session, status } = useSession()
    const isAuth = !!session 

  return <motion.nav initial={{ opacity: 0, y: -17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: 'spring', damping: 7, stiffness: 100 }}
  className='fixed inset-x-0 top-0 z-[999] p-3 flex items-center justify-between border-b border-zinc-300 backdrop-blur-md'>
          <div className='flex items-center gap-2 p-2 border-4 border-blue-400 rounded-lg hover:-translate-y-2 duration-300'>
              <MessagesSquare className='size-7 fill-blue-500 text-blue-500' strokeWidth={3}/>
              <h3 className='bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent font-bold'>QuickChat</h3>
          </div>
          <div className='flex items-center gap-2'>
             <ThemeToggle />
             {status === 'loading' ? 
                <Loader2 className='animate-spin size-10'/> : 
                isAuth ? <UserAccountNav /> : <Link className='flex items-center font-medium mb:hidden gap-2 p-2 rounded-lg bg-blue-700 text-xl text-white group' href={'/signin'}>Sign in<LogIn className='group-hover:translate-x-1 duration-200'/></Link>}   
         </div>
  </motion.nav>
}
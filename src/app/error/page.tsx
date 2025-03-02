import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "~/server/auth"
import { ArrowLeft } from 'lucide-react'

export default async function AuthErrorPage() {

    const session = await auth()
    if(session?.user) return redirect('/')
 
  return <div className="w-full min-h-screen flex-center">
       <div className="flex flex-col items-center gap-2">
           <h1 className="text-red-500 font-bold text-3xl">Something went wrong. Please try again!</h1>
           <Link href={'/signin'} className="font-semibold group bg-black text-white dark:text-black px-3 py-2 flex-center gap-2 rounded-lg dark:bg-white"><ArrowLeft className="group-hover:-translate-x-1 duration-200"/>Go to signin</Link>
       </div>
  </div>
}
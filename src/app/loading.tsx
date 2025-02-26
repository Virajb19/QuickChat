import { Loader } from 'lucide-react';

export default function Loading() {
    return <main className="w-full min-h-screen flex-center">
            <Loader className='size-20 animate-spin text-blue-600' />
        </main> 
}
"use client";

import Box from '@/components/Box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import React, { useState } from 'react'

const HomeSearchContainer = () => {
    const [title, setTitle] = useState("");
    const router = useRouter();

    const handleSearchClick = () => {
       
        const href = queryString.stringifyUrl({
            url: "/search",
            query: {
                title: title || undefined,
            }
        });

        router.push(href);
    }
  return (
    <div className='w-full items-center justify-center hidden md:flex mt-12 px-4'>
        <Box className='w-3/4 p-4 border rounded-full h-16 px-8 text-muted-foreground gap-3 bg-neutral-50'>
            <Input 
            value={title} 
            placeholder='Search by job name...' 
            onChange={(event) => setTitle(event.target.value) } 
            className='flex-1 text-lg font-sans bg-transparent outline-none border-0 min-w-72 focus:ring-transparent focus-visible:ring-neutral-50 focus:outline-transparent focus:border-transparent'
            />
            <Button onClick={handleSearchClick} size={"icon"} className='bg-purple-600 hover:bg-purple-700' disabled={!title}>
                <Search className='w-5 h-5 min-w-5' />
            </Button>
        </Box>
    </div>
  )
}

export default HomeSearchContainer
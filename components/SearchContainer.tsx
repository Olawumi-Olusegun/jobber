"use client";

import { Search, X } from 'lucide-react';
import React, { ChangeEvent, useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';

const SearchContainer = () => {

    const [searchInput, setSearchInput] = useState("");

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {  value } = event.target;
        setSearchInput(value);
    }


  return (
    <div className='flex items-center gap-x-2 relative flex-1'>
        <Search className='h-4 w-4 text-neutral-600 absolute left-3' />
        <Input 
            className='w-full pl-9 rounded-lg bg-purple-50/80 focus-visible:ring-purple-200 text-sm' 
            placeholder='Search jobs using title' 
            value={searchInput} 
            onChange={handleInputChange} 
        />
        {
            searchInput.trim() && <Button 
            type='button' onClick={() => setSearchInput("")} 
            variant={"ghost"} size={"icon"}
            className='absolute right-3 h-8 w-8 hover:bg-transparent'
            >
                <X className='w-4 h-4 hover:scale-125 duration-300' />
            </Button>
        }
    </div>
  )
}

export default SearchContainer
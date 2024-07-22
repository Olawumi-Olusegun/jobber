
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react'

interface ListItemProps {
    category: any;
    onSelect: (category: any) => void;
    isChecked: boolean;
}


const ListItem = ({category, onSelect, isChecked}: ListItemProps) => {
  return (
    <div onClick={() => onSelect(category)} className='flex items-center px-2 py-1 cursor-pointer hover:bg-gray-200'>
        <Check className={cn("mr-2 h-4 w-4", isChecked ? "opacity-100" : "opacity-0")} />
        <span className='w-full truncate text-sm whitespace-nowrap'>{category.label}</span>
    </div>
  )
}

export default ListItem
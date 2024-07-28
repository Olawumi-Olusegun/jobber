"use client";

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import { usePathname, useRouter } from 'next/navigation';
import queryString from 'query-string';


const DateFilter = () => {

    const router = useRouter();
    const pathname = usePathname();

    const data = [
        { value: "today", label: "Today" },
        { value: "yesterday", label: "Yesterday" },
        { value: "thisWeek", label: "This Week" },
        { value: "lastWeek", label: "Last Week" },
        { value: "thisMonth", label: "This Month" },
      ];

      const onChangeSelected = (selectedValue: string) => {
        const currentQueryParams = queryString.parseUrl(window.location.href).query;
        const updatedQueryParams = {...currentQueryParams, createdAtFilter: selectedValue};
        const url = queryString.stringifyUrl({
            url: pathname,
            query: updatedQueryParams
        }, { skipNull: true, skipEmptyString: true})

        router.push(url)
      }

  return (
    <div>
        <Select onValueChange={(selected) => onChangeSelected(selected) }>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent className='cursor-pointer'>
                {
                    data?.map((item) => (
                        <SelectItem  
                        className='cursor-pointer' 
                        key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    </div>
  )
}

export default DateFilter
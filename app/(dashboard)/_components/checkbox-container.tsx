"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react'

interface AppliedFilter {
    value: string;
    label: string;
    checked?: boolean;
}

interface CheckBoxContainerProps {
    data: AppliedFilter[];
    onChange: (dataValue: string[]) => void;
}

const CheckBoxContainer = ({data, onChange}: CheckBoxContainerProps) => {
    
    const [filters, setFilters] = useState<AppliedFilter[]>(data);

    const handleCheckedChange = (applied: AppliedFilter) => {
        const updatedFilters = filters.map((item) => {
            if(item.value === applied.value) {
                return  {
                    ...item,
                    checked: !item.checked
                }
            }

            return item;
        })

        setFilters(updatedFilters)

        const newUpdatedFilters = updatedFilters.filter((item) => item.checked).map((item) => item.value);

        onChange(newUpdatedFilters)
    }

    useEffect(() => {
        setFilters(data)
    }, [data]);


  return (
    <>
     <div className="w-full flex flex-col items-start justify-start gap-2">
        {
            filters.map((item) => (
                <label key={item.value} className={cn("flex items-center gap-2", item.checked ? "text-purple-500" : "text-neutral-700")}>
                    <Checkbox checked={item.checked ?? false} onCheckedChange={() => handleCheckedChange(item)} /> 
                    <span>{item.label}</span>
                </label>
            ))
        }
     </div>
    </>
  )
}

export default CheckBoxContainer
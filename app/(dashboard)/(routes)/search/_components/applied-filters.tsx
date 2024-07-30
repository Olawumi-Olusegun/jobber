"use client";

import { Button } from '@/components/ui/button';
import { Category } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'


interface AppliedFiltersProps {
    categories: Category[]
}

const AppliedFilters = ({categories}: AppliedFiltersProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentParams = Object.fromEntries(searchParams.entries());

    const shiftTimingParams = Object.fromEntries(
        Object.entries(currentParams).filter(([key]) => key === "shiftTiming")
    );

    const workModeParams = Object.fromEntries(
        Object.entries(currentParams).filter(([key]) => key === "workMode")
    );

    const getCategoryName = (categoryId: string | null) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category?.name : categoryId;
    }

    if(searchParams.size === 0) return null;

  return (
    <>
    <div className='mt-4 flex items-center gap-4 w-full'>
        {
            shiftTimingParams && Object.entries(shiftTimingParams).map(([key, value]) => (
                <div key={key} className='flex items-center gap-x-2'>
                    {
                        value.split(",").map((item) => (
                            <Button 
                            type='button'
                            variant={"outline"}
                            key={item} 
                            className='flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 hover:bg-purple-50/90 capitalize'>
                                {item}
                            </Button>
                        ))
                    }
                </div>
            ))
        }
        {
            workModeParams && Object.entries(workModeParams).map(([key, value]) => (
                <div key={key} className='flex items-center gap-x-2'>
                    {
                        value.split(",").map((item) => (
                            <Button 
                            type='button'
                            variant={"outline"}
                            key={item} 
                            className='flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 hover:bg-purple-50/90 capitalize'>
                                {item}
                            </Button>
                        ))
                    }
                </div>
            ))
        }
        {
            searchParams.has("categoryId") && (
                <Button 
                type='button'
                variant={"outline"}
                className='flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 hover:bg-purple-50/90 capitalize'>
                    {getCategoryName(searchParams.get("categoryId"))}
                </Button>
            )
        }
    </div>
        {
            searchParams.get("title") && (
                <div className="flex items-center justify-center flex-col my-4">
                    <h2 className="text-2xl text-muted-foreground text-center">
                        You searched for: <span className='font-bold text-neutral-900 capitalize px-2'>{searchParams.get("title")}</span>
                    </h2>
                </div>
            )
        }
    </>
  )
}

export default AppliedFilters
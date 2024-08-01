"use client";

import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BadgeCheck, Ban,Loader2, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CellActionsProps {
    id: string;
    fullName: string;
    email: string;
}

const CellActions =  ({ id, fullName, email }: CellActionsProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isRejection, setIsRejection] = useState(false);
    const router = useRouter();

    const handleSendSelected = async () => {
        setIsLoading(true);
        try {
            await axios.post("/api/send-selected", {email, fullName})
            toast.success("Accepted email sent")
        } catch (error) {
            toast.error((error as Error)?.message)
        } finally {
            setIsLoading(false);
            router.refresh()
        }
    }
    const handleSendRejected = async () => {
        setIsRejection(true);
        try {
            await axios.post("/api/send-rejected", {email, fullName})
            toast.success("Rejection email sent")
        } catch (error) {
            toast.error((error as Error)?.message)
        } finally {
            setIsRejection(false);
            router.refresh()
        }
    }

  return (
    <>
              <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className=' h-8 w-8 focus-visible:ring-purple-300 '>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSendSelected} className="cursor-pointer flex items-center justify-between gap-1.5">
                {
                    <span className='flex items-center gap-1'>
                        {
                            isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> 
                                      : <BadgeCheck className='w-4 h-4' /> 
                        }
                        Selected
                    </span>
                }
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSendRejected} className="cursor-pointer flex items-center justify-between">
                {
                    <span className='flex items-center gap-1'>
                        {
                            isRejection ? <Loader2 className='w-4 h-4 animate-spin' /> 
                                        : <Ban className='w-4 h-4' /> 
                        }
                        Rejected
                    </span>
                }
            </DropdownMenuItem>

            </DropdownMenuContent>
            </DropdownMenu>
    </>
  )
}

export default CellActions
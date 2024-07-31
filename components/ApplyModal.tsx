"use client";

import { Resumes, UserProfile } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import Modal from './modal';
import Box from './Box';
import { FileIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';


interface ApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    userProfile: UserProfile & { resumes: Resumes[] } | null;
  }



const ApplyModal = ({isOpen, onClose, onConfirm, isLoading, userProfile}: ApplyModalProps) => {
    
    const [isMounted, setIsMounted] = useState(false);

    const activeResume = userProfile?.resumes.find((resume) => resume.id === userProfile.activeResumeId)?.name;

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) {
        return null;
    }
  
    return (
    <>
        <Modal 
         title='Are you sure?'
         description="This action cannot be undone"
         isOpen={isOpen}
         onClose={onClose}
        >
           <Box>
            <div className="grid grid-cols-2 gap-2 w-full">
                <label htmlFor="userName" className='p-3 border rounded-md'>{userProfile?.fullName}</label>
                <label htmlFor="contact" className='p-3 border rounded-md'>{userProfile?.contact}</label>
                <label htmlFor="email" className='p-3 border rounded-md col-span-2'>{userProfile?.email}</label>
                <label htmlFor="userName" className='p-3 border rounded-md col-span-2 flex items-center gap-2 whitespace-nowrap'>
                    <div className="w-full flex items-center gap-2 whitespace-nowrap text-sm">
                        <span>Your Active Resume:</span> 
                        <FileIcon className="w-4 h-4 text-purple-700" /> 
                        <span className='truncate text-purple-700'>{activeResume}</span>
                    </div>
                </label>

                <div className="col-span-2 flex items-center justify-end text-sm text-muted-foreground">
                    Change your details
                    <Link href={`/user`} className='text-purple-700 ml-2'>over here</Link>
                </div>

            </div>
           </Box>
           <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button disabled={isLoading} variant={"outline"} onClick={onClose}>
                Cancel
            </Button>

            <Button disabled={isLoading} className='bg-purple-700 hover:bg-purple-800' onClick={onConfirm}>
                Continue
            </Button>

           </div>
        </Modal>
    </>
  )
}

export default ApplyModal
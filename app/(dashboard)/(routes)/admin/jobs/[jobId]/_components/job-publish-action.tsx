"use client";

import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import React, { useState } from 'react'

interface JobPusblishActionProps {
    disabled: boolean;
    jobId: string;
    isPublished: boolean;
}

const JobPublishAction = ({disabled, jobId, isPublished}: JobPusblishActionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handlePublishJob = async () => {
      try {
        
      } catch (error) {
        
      } finally {
        setIsLoading(false)
      }
    }

    const handleDeleteJob = async () => {
      try {
        
      } catch (error) {
        
      } finally {
        setIsLoading(false)
      }
    }

  return (
    <>
     <div className="flex items-center gap-x-3">
        <Button 
        size={"sm"}
        disabled={disabled || isLoading} 
        variant={"outline"}
        className='disabled:cursor-not-allowed'
        onClick={() => {}}
        >
            {isPublished ? "Unpublish" : "Publish"} 
        </Button>
        <Button 
        variant={"destructive"} 
        size={"icon"} 
        disabled={isLoading}
        className='w-8 h-8 disabled:cursor-pointer'
        onClick={handleDeleteJob}
        >
            <Trash className="w-4 h-4" />
        </Button>
     </div>
    </>
  )
}

export default JobPublishAction
"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface JobPusblishActionProps {
    disabled: boolean;
    jobId: string;
    isPublished: boolean;
}

const JobPublishAction = ({disabled, jobId, isPublished}: JobPusblishActionProps) => {
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();
    
    const handlePublishJob = async () => {
      setIsPublishing(true)
      try {
        if(isPublished) {
          await axios.patch(`/api/jobs/${jobId}/unpublish`)
          toast.success("Job Unpublished")
        } else {
          await axios.patch(`/api/jobs/${jobId}/publish`)
          toast.success("Job published")
        }
        router.refresh();
      } catch (error) {
        toast.error((error as any)?.message)
      } finally {
        setIsPublishing(false)
      }
    }

    const handleDeleteJob = async () => {
      setIsDeleting(true)
      try {
        await axios.delete(`/api/jobs/${jobId}`)
        toast.success("Job deleted")
        router.refresh();
        router.push("/admin/jobs");
      } catch (error) {
        toast.error((error as any)?.message)
      } finally {
        setIsDeleting(false)
      }
    }

  return (
    <>
     <div className="flex items-center gap-x-3">
        <Button 
        size={"sm"}
        disabled={disabled || isPublishing} 
        variant={"outline"}
        className='disabled:cursor-not-allowed'
        onClick={handlePublishJob}
        >
          {isPublishing && <Loader2 className='w-3 h-3 mr-1 animate-spin' />}
          {isPublished ? "Unpublish" : "Publish"} 
        </Button>
        <Button 
        variant={"destructive"} 
        size={"icon"} 
        disabled={disabled || isDeleting}
        className='w-8 h-8 disabled:cursor-pointer'
        onClick={handleDeleteJob}
        >
            { isDeleting 
                ? <Loader2 className='w-3 h-3 animate-spin' /> 
                :  <Trash className="w-4 h-4" />
            }
        </Button>
     </div>
    </>
  )
}

export default JobPublishAction
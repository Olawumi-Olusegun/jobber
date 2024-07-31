"use client";

import AttachmentsUpload from '@/components/attachments-uploads';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile, Resumes } from '@prisma/client';
import axios from 'axios';
import { File, Loader2, PlusCircle, ShieldCheck, ShieldX, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface ResumeFormProps {
    initialData: UserProfile & { resumes: Resumes[] } | null;
    userId: string;
}

const ResumeFormSchema = z.object({
    resumes: z.object({ url: z.string().trim().min(1), name: z.string().trim().min(1) }).array()
});


const ResumeForm = ({initialData, userId}: ResumeFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [activeResumeId, setActiveResumeId] = useState<string | null>(null)

    const router = useRouter();

    const initialResumes = Array.isArray(initialData?.resumes)
    ? initialData.resumes.map((resume: any) => {
        if (
          typeof resume === "object" &&
          resume !== null &&
          "url" in resume &&
          "name" in resume
        ) {
          return { url: resume.url, name: resume.name };
        }
        return { url: "", name: "" }; // Provide default values if the shape is incorrect
      })
    : [];

    const form = useForm<z.infer<typeof ResumeFormSchema>>({
        resolver: zodResolver(ResumeFormSchema),
        defaultValues: {
            resumes: initialResumes
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleFormSubmit = async (values: z.infer<typeof ResumeFormSchema>) => {
        if(!values) return;
        try {
            await axios.post(`/api/users/${userId}/resumes`, values);
            toast.success("Resume updated");
            form.setValue("resumes", [])
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const handleDeleteImage = async (resume: Resumes) => {
        if(!resume.id || !userId) return;

        if(initialData?.activeResumeId === resume.id) {
            toast.error("You can't delete an active resume")
            return;
        }
        
        try {
            setIsDeleting(true)
            setDeletingId(resume.id)
            await axios.delete(`/api/users/${userId}/resumes/${resume.id}`);
            toast.success("Resume removed");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error((error as any)?.message);
        } finally {
            setIsDeleting(false)
        }
    }

    const setActiveResume = async (resume: Resumes) => {
        if(!resume.id || !userId) return;

        if(initialData?.activeResumeId === resume.id) {
            toast.error("This resume is currently active")
            return;
        }

        try {
            setActiveResumeId(resume.id)
            await axios.patch(`/api/users/${userId}`, { activeResumeId: resume.id });
            toast.success("Resume Activated");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error((error as any)?.message);
        } finally {
            setActiveResumeId(null)
        }
    }


    const toggleEditing = () => setIsEditing((prevState) => !prevState)

  return (
    <div className='mt-4 border rounded-md w-full p-4 '>
        <div className="font-medium flex items-center justify-between mb-3">
        <span>Your Resume</span>
            <Button variant={"ghost"} onClick={toggleEditing} className=' h-full p-4 flex items-center gap-x-1.5'>
                
                {isEditing 
                ? <>
                    <X className='w-4 h-4' />
                    <span>Cancel</span>
                </>
                : <>
                    
                    <PlusCircle className='w-4 h-4' />
                    <span>Add a file</span>
                  </>
                }
            </Button>
        </div>
        {
            !isEditing && (initialData?.resumes && initialData?.resumes?.length > 0
                ? initialData?.resumes.map((resume) => (
                    <div key={resume.url}  className="grid grid-cols-12 w-full gap-1.5 items-center">
                        <div className="col-span-9 md:col-span-10 relative flex items-center gap-x-1.5 mb-2 p-3 w-full rounded-md bg-purple-100 border-purple-200 border text-purple-700">
                        <File className='w-4 h-4' />
                        <p  className="text-xs w-full flex-1 truncate">{resume.name}</p>

                        {
                            deletingId === resume.id ? <Button  variant={"ghost"} size={"icon"} className='cursor-default size-8 hover:bg-transparent'>
                                                            <Loader2 className='size-4 animate-spin' />
                                                        </Button>
                                                    :  <Button  onClick={() => handleDeleteImage(resume)}  variant={"ghost"} size={"icon"} className='disabled:cursor-not-allowed size-8'>
                                                            <X className='size-4' />
                                                       </Button>
                        }
                    </div>

                    <div className="col-span-3 md:col-span-2 flex items-center justify-center w-full">
                        {activeResumeId === resume.id  
                            ? <Loader2 className='w-4 h-4 animate-spin' />
                            : <Button disabled={isSubmitting} onClick={() => setActiveResume(resume)} variant={"ghost"} className={cn("w-full flex items-center justify-center", initialData.activeResumeId === resume.id ? "text-emerald-500" : "text-red-500")}>
                                {
                                  initialData.activeResumeId === resume.id ? "Live" : "Activate"  
                                }
                                {
                                    initialData.activeResumeId === resume.id 
                                    ? <ShieldCheck className='w-4 h-4 ml-2' />
                                    : <ShieldX  className='w-4 h-4 ml-2' />
                                }
                            </Button>
                        }

                    </div>
                    </div>
                ))
                : <p className='italic text-neutral-500'>No resumes</p>
            )
            
        }
        {
            isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className='flex flex-col gap-y-3 w-full'>
                        <FormField  
                         control={form.control}
                         name='resumes'
                         render={({field}) => (
                            <FormItem className='h-32'>
                                <FormControl>
                                    <AttachmentsUpload  
                                     value={field.value}
                                     disabled={isSubmitting}
                                     onChange={(resumes) => {
                                        if(resumes) {
                                            handleFormSubmit({resumes})
                                        }
                                     } }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}
                        />
                        <div className="flex items-center justify-center gap-x-2 my-5">
                            <Button type='submit' disabled={isSubmitting || !isValid || isDeleting }>
                                { isSubmitting ? <Loader2 className='h-4 w-4 animate-spin' /> : "Save" }
                            </Button>
                        </div>
                    </form>
                </Form>
            )
        }
    </div>
  )
}

export default ResumeForm
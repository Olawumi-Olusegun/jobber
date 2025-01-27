"use client";

import AttachmentsUpload from '@/components/attachments-uploads';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Attachment, Job } from '@prisma/client';
import axios from 'axios';
import { File, Loader2, Pencil, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface AttachementFormProps {
    initialData: Job & { attachments: Attachment[] };
    jobId: string;
}

const ImageFormSchema = z.object({
    attachments: z.object({ url: z.string().trim().min(1), name: z.string().trim().min(1) }).array()
});


const AttachementForm = ({initialData, jobId}: AttachementFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const router = useRouter();

    const initialAttachments = Array.isArray(initialData?.attachments)
    ? initialData.attachments.map((attachment: any) => {
        if (
          typeof attachment === "object" &&
          attachment !== null &&
          "url" in attachment &&
          "name" in attachment
        ) {
          return { url: attachment.url, name: attachment.name };
        }
        return { url: "", name: "" }; // Provide default values if the shape is incorrect
      })
    : [];

    const form = useForm<z.infer<typeof ImageFormSchema>>({
        resolver: zodResolver(ImageFormSchema),
        defaultValues: {
            attachments: initialAttachments
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleFormSubmit = async (values: z.infer<typeof ImageFormSchema>) => {
        if(!values) return;
        try {
            await axios.post(`/api/jobs/${jobId}/attachments`, values);
            toast.success("Job attachments updated");
            form.setValue("attachments", [])
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const handleDeleteImage = async (attachment: Attachment) => {
        if(!attachment.id || !jobId) return;
        try {
            setIsDeleting(true)
            setDeletingId(attachment.id)
            await axios.delete(`/api/jobs/${jobId}/attachments/${attachment.id}`);
            toast.success("Attachments removed");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error((error as any)?.message);
        } finally {
            setIsDeleting(false)
        }
    }




    const toggleEditing = () => setIsEditing((prevState) => !prevState)

  return (
    <div className='mt-4 border bg-neutral-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between mb-2 ">
            Job Attachments
            <Button variant={"ghost"} onClick={toggleEditing}>
                {isEditing 
                ? "Cancel"
                : <>
                    <Pencil className='w-4 h-4 mr-2' />
                    <span>Edit</span>
                  </>
                }
            </Button>
        </div>
        {
            !isEditing && (initialData.attachments.length > 0
                ? initialData?.attachments.map((attachment) => (
                    <div key={attachment.url} className="relative flex items-center gap-x-1.5 mb-2 p-3 w-full rounded-md bg-purple-100 border-purple-200 border text-purple-700">
                        <File className='w-4 h-4' />
                        <p  className="text-xs w-full flex-1 truncate">{attachment.name}</p>

                        {
                            deletingId === attachment.id ? <Button  variant={"ghost"} size={"icon"} className='cursor-default size-8 hover:bg-transparent'>
                                                                <Loader2 className='size-4 animate-spin' />
                                                            </Button>
                                                         :  <Button  onClick={() => handleDeleteImage(attachment)}  variant={"ghost"} size={"icon"} className='disabled:cursor-not-allowed size-8'>
                                                                <X className='size-4' />
                                                            </Button>
                        }
                    </div>
                ))
                : <p className='italic text-neutral-500'>No attachments</p>
            )
            
        }
        {
            isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className='flex flex-col gap-y-3'>
                        <FormField  
                         control={form.control}
                         name='attachments'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <AttachmentsUpload  
                                     value={field.value}
                                     disabled={isSubmitting}
                                     onChange={(attachments) => {
                                        if(attachments) {
                                            handleFormSubmit({attachments})
                                        }
                                     } }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}
                        />
                        <div className="flex items-center gap-x-2">
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

export default AttachementForm
"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import getGenerativeAIResponse from '@/scripts/aistudio';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import { Lightbulb, Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface ShortDescriptionFormProps {
    initialData: Job;
    jobId: string;
}

const ShortDescriptionFormSchema = z.object({
    short_desciption: z.string().trim().min(1)
});

const ShortDescription = ({initialData, jobId }: ShortDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [isPrompting, setIsPrompting] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof ShortDescriptionFormSchema>>({
        resolver: zodResolver(ShortDescriptionFormSchema),
        defaultValues: {
            short_desciption: initialData.short_desciption || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleShortDscriptionFormSubmit = async (values: z.infer<typeof ShortDescriptionFormSchema>) => {
        try {
            if(isPrompting) return;
            const { data } = await axios.patch(`/api/jobs/${jobId}`, values);
            toast.success("Short description updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const handlePromptGeneration = async () => {
        if(!prompt.trim()) return;
        try {
            setIsPrompting(true)
            const customPrompt = `Could you craft a concise job description for a ${prompt} position in fewer than 400 characters?`;
           const data =  await getGenerativeAIResponse(customPrompt);
           form.setValue("short_desciption", data)
           setPrompt("")
        } catch (error) {
            console.log(error)
            toast.error((error as any)?.message)
        } finally {
            setIsPrompting(false)
        }
    }

    const toggleEditing = () => setIsEditing((prevState) => !prevState)
    

  return (
    <div className='mt-4 border bg-neutral-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between mb-2">
            Short Description
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
            !isEditing && (
            <p className={cn("text-sm mt-2", !initialData.short_desciption && "italic text-neutral-500")}>
                { initialData.short_desciption || "No Short Description" }
            </p>)
        }
        {
            isEditing && (
                <>
                <p className='text-xs mb-2'>Note<span className='text-destructive'>*</span> Name of profession is enough to generate tags</p>
                <div className="flex items-center gap-x-2  w-full my-3">
                    <Input onChange={(event) => setPrompt(event.target.value)} value={prompt} className='flex-1' disabled={isPrompting} placeholder='Short Description of profession'  />
                    {
                        isPrompting
                            ? <Button size={"icon"} className='h-9 w-9'> <Loader2 className='h-4 w-4 animate-spin' /> </Button>
                            : <Button type='button' onClick={handlePromptGeneration} size={"icon"} disabled={!prompt.trim()} className='text-white w-9 h-9'> <Lightbulb className='w-4 h-4' /> </Button>
                    }
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleShortDscriptionFormSubmit)} className='flex flex-col gap-y-3'>
                            <FormField
                            control={form.control}
                            name='short_desciption'
                            render={({field}) => (
                                <FormItem className='w-full'>
                                    <FormControl className='flex-1'>
                                        <Textarea  disabled={isSubmitting} placeholder='Short Description' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                        <div className="flex items-center gap-x-2">
                            <Button type='submit' disabled={isSubmitting || !isValid}>
                                { isSubmitting ?  <Loader2 className='h-4 w-4 animate-spin' /> : "Save" }
                            </Button>
                        </div>

                    </form>
                </Form>
                
                </>
            )
        }
    </div>
  )
}

export default ShortDescription
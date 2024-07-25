"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import getGenerativeAIResponse from '@/scripts/aistudio';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import {  Lightbulb, Loader2, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface TagsFormProps {
    initialData: Job;
    jobId: string;
}

const TagsFormSchema = z.object({
    tags: z.array(z.string().trim()).min(1)
});

const TagsForm = ({initialData, jobId }: TagsFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [jobTags, setJobTags] = useState( initialData.tags || []);
    const [isPrompting, setIsPrompting] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof TagsFormSchema>>({
        resolver: zodResolver(TagsFormSchema),
        defaultValues: {
            tags: initialData.tags || []
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleJobTagsFormSubmit = async (values: z.infer<typeof TagsFormSchema>) => {
        try {
            if(isPrompting || jobTags.length === 0) return;
            const { data } = await axios.patch(`/api/jobs/${jobId}`, values);
            toast.success("Job tags updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const handlePromptGeneration = async () => {

        try {
            setIsPrompting(true)
            const customPrompt = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.`;
            let response = await getGenerativeAIResponse(customPrompt);
            const data = JSON.parse(response)
            if(Array.isArray(data)) {
                setJobTags((prevTags) => ([...prevTags, ...data]))
            }
           
        } catch (error) {
            console.log(error)
            toast.error((error as any)?.message)
        } finally {
            setIsPrompting(false)
        }
    }

    const handleTagRemove = (index: number) => {
        const updatedTags = [...jobTags];
        updatedTags.splice(index, 1);
        setJobTags(updatedTags);
    }

    const toggleEditing = () => setIsEditing((prevState) => !prevState)
    

  return (
    <div className='mt-4 border bg-neutral-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between mb-2">
            Description
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
                <div className="flex items-center gap-2 flex-wrap">
                    {
                        jobTags.length > 0 ?(
                            jobTags.map((tag, index) => (
                            <div key={`${tag}-${index}`} className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100">
                                    {tag}
                                    {isEditing && (
                                        <Button onClick={() => handleTagRemove(index)} className='h-5 w-5' variant={"ghost"} size={"icon"}>
                                            <X className='h-3 w-3' />
                                        </Button>
                                    ) }
                            </div>

                            ))

                        ): <p>No Tags</p>
                    }

                </div>
            )
        }
        {
            isEditing && (
                <>
                <p className='text-xs mb-2'>Note<span className='text-destructive'>*</span> Name of profession is enough to generate tags </p>
                <div className="flex flex-col sm:flex-row items-center gap-2  w-full my-3">
                    <Input onChange={(event) => setPrompt(event.target.value)} value={prompt} className='flex-1' disabled={isPrompting} placeholder='React.Js, Next.Js, Css,'  />
                   
                    {
                        isPrompting
                            ? <Button size={"icon"} disabled={!prompt.trim()} className='h-9 w-9'> <Loader2 className='h-4 w-4 animate-spin' /> </Button>
                            : <Button type='button' disabled={!prompt.trim()} onClick={handlePromptGeneration} size={"icon"} className='text-white w-9 h-9'> <Lightbulb className='w-4 h-4' /> </Button>
                    }
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {
                        jobTags.length > 0 ?(
                            jobTags.map((tag, index) => (
                            <div key={`${tag}-${index}`} className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100">
                                    {tag}
                                    {isEditing && (
                                        <Button onClick={() => handleTagRemove(index)} className='h-5 w-5' variant={"ghost"} size={"icon"}>
                                            <X className='h-3 w-3' />
                                        </Button>
                                    ) }
                            </div>

                            ))

                        ): <p>No Tags</p>
                    }

                </div>

                <div className="flex items-center gap-2 justify-end mt-4">
                    <Button 
                    disabled={isSubmitting || jobTags.length === 0}
                    onClick={() => {
                        setJobTags([]);
                        handleJobTagsFormSubmit({tags: []})
                    }} type='button' variant={"outline"}>Clear All</Button>
                   
                    <Button
                    disabled={isSubmitting || jobTags.length === 0}
                    onClick={() => handleJobTagsFormSubmit({tags: jobTags})}
                    >
                        Save
                    </Button>
                </div>
                
                </>
            )
        }
    </div>
  )
}

export default TagsForm
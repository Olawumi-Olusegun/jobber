"use client";

import Editor from '@/components/editor';
import EditorPreview from '@/components/editor-preview';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import getGenerativeAIResponse from '@/scripts/aistudio';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import { Copy, Lightbulb, Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface JobDescriptionFormProps {
    initialData: Job;
    jobId: string;
}

const JobDescriptionFormSchema = z.object({
    description: z.string().trim().min(1)
});

const JobDescription = ({initialData, jobId }: JobDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [aiValue, setAiValue] = useState("");
    const [skills, setSkills] = useState("");
    const [isPrompting, setIsPrompting] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof JobDescriptionFormSchema>>({
        resolver: zodResolver(JobDescriptionFormSchema),
        defaultValues: {
            description: initialData.description || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleJobDscriptionFormSubmit = async (values: z.infer<typeof JobDescriptionFormSchema>) => {
        try {
            if(isPrompting) return;
            const { data } = await axios.patch(`/api/jobs/${jobId}`, values);
            toast.success("Job description updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const handlePromptGeneration = async () => {

        try {
            setIsPrompting(true)
           const customPrompt = `Could you please draft a job requirements document for the position of ${roleName}?. The job description should include roles and responsibilities, key features and details about the role. The required skills should include proficiency in ${skills}. Additionally, you can list any optional skill related to job. Thanks!`;
            let response = await getGenerativeAIResponse(customPrompt);
            response = response.replace(/^'|'$/g, "");
            const cleanedText = response.replace(/[\*\#]/g, "");
            setAiValue(cleanedText);
            setRoleName("");
            setSkills("")
        } catch (error) {
            console.log(error)
            toast.error((error as any)?.message)
        } finally {
            setIsPrompting(false)
        }
    }

    const handleOnCopy = () => {
        navigator.clipboard.writeText(aiValue);
        toast.success("Copied to clipboard");
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
            <div className={cn("text-sm mt-2", !initialData.description && "text-neutral-500 italic")}>
                { initialData.description
                    ? <EditorPreview value={initialData.description} /> 
                    : "No Description" 
                }
            </div>)
        }
        {
            isEditing && (
                <>
                <p className='text-xs mb-2'>Note<span className='text-destructive'>*</span> Name of profession and skill should be delimited by comma </p>
                <div className="flex flex-col sm:flex-row items-center gap-2  w-full my-3">
                    <Input onChange={(event) => setRoleName(event.target.value)} value={roleName} className='flex-1' disabled={isPrompting} placeholder='Job role name'  />
                    <Input onChange={(event) => setSkills(event.target.value)} value={skills} className='flex-1' disabled={isPrompting} placeholder='Required skills'  />
                    {
                        isPrompting
                            ? <Button size={"icon"} disabled={!roleName.trim()} className='h-9 w-9'> <Loader2 className='h-4 w-4 animate-spin' /> </Button>
                            : <Button type='button' disabled={!skills.trim()} onClick={handlePromptGeneration} size={"icon"} className='text-white w-9 h-9'> <Lightbulb className='w-4 h-4' /> </Button>
                    }
                </div>
                {
                    aiValue && (
                        <div className="w-full h-96 max-h-96 rounded-md bg-white text-sm overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
                            {aiValue}
                        <Button onClick={handleOnCopy} className='absolute top-3 right-3 z-10' variant={"outline"} size={"icon"}>
                            <Copy className='h-4 w-4' />
                        </Button>
                        </div>
                    )
                }
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleJobDscriptionFormSubmit)} className='flex flex-col gap-y-3'>
                            <FormField
                            control={form.control}
                            name='description'
                            render={({field}) => (
                                <FormItem className='w-full'>
                                    <FormControl className='flex-1'>
                                        <Editor {...field} />
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

export default JobDescription
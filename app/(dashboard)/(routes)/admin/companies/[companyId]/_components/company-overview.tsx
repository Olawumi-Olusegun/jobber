"use client";

import Editor from '@/components/editor';
import EditorPreview from '@/components/editor-preview';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import getGenerativeAIResponse from '@/scripts/aistudio';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company } from '@prisma/client';
import axios from 'axios';
import { Copy, Lightbulb, Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface CompanyDescriptionFormProps {
    initialData: Company;
    companyId: string;
}

const CompanyDescriptionFormSchema = z.object({
    overview: z.string().trim().min(1)
});

const CompanyDescription = ({initialData, companyId }: CompanyDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [aiValue, setAiValue] = useState("");
    const [skills, setSkills] = useState("");
    const [isPrompting, setIsPrompting] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof CompanyDescriptionFormSchema>>({
        resolver: zodResolver(CompanyDescriptionFormSchema),
        defaultValues: {
            overview: initialData.overview || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleFormSubmit = async (values: z.infer<typeof CompanyDescriptionFormSchema>) => {
        try {
            if(isPrompting) return;
            await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("Company overview updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const handlePromptGeneration = async () => {

        try {
            setIsPrompting(true)
           const customPrompt = `Generate an overview content about ${roleName}. Include information about its history, purpose, features, user base, and impact on the industry. Focus on providing a comprehensive yet concise summary suitable for readers unfamiliar with the platform.`;
            let response = await getGenerativeAIResponse(customPrompt);
            response = response.replace(/^'|'$/g, "");
            const cleanedText = response.replace(/[\*\#]/g, "");
            setAiValue(cleanedText);
            setRoleName("");
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
            Overview
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
            <div className={cn("text-sm mt-2", !initialData.overview && "text-neutral-500 italic")}>
                { initialData.overview
                    ? <EditorPreview value={initialData.overview} /> 
                    : "No Description" 
                }
            </div>)
        }
        {
            isEditing && (
                <>
                <p className='text-xs mb-2'>Note<span className='text-destructive'>*</span> Type the name of company to generate overview</p>
                <div className="flex flex-col sm:flex-row items-center gap-2  w-full my-3">
                    <Input onChange={(event) => setRoleName(event.target.value)} value={roleName} className='flex-1' disabled={isPrompting} placeholder='e.g Creative Studio'  />
                    {
                        isPrompting
                            ? <Button size={"icon"} disabled={!roleName.trim()} className='h-9 w-9'> <Loader2 className='h-4 w-4 animate-spin' /> </Button>
                            : <Button type='button' disabled={!roleName.trim()} onClick={handlePromptGeneration} size={"icon"} className='text-white w-9 h-9'> <Lightbulb className='w-4 h-4' /> </Button>
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
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className='flex flex-col gap-y-3'>
                            <FormField
                            control={form.control}
                            name='overview'
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

export default CompanyDescription
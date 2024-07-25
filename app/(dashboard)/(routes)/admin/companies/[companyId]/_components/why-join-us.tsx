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

interface WhyJoinUsFormProps {
    initialData: Company;
    companyId: string;
}

const WhyJoinUsFormSchema = z.object({
    whyJoinUs: z.string().trim().min(1)
});

const WhyJoinUs = ({initialData, companyId }: WhyJoinUsFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [aiValue, setAiValue] = useState("");
    const [skills, setSkills] = useState("");
    const [isPrompting, setIsPrompting] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof WhyJoinUsFormSchema>>({
        resolver: zodResolver(WhyJoinUsFormSchema),
        defaultValues: {
            whyJoinUs: initialData.whyJoinUs || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleFormSubmit = async (values: z.infer<typeof WhyJoinUsFormSchema>) => {
        try {
            if(isPrompting) return;
            await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("Company whyJoinUs updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const handlePromptGeneration = async () => {

        try {
            setIsPrompting(true)
           const customPrompt = `Create a compelling "Why join us" content piece for ${roleName}. Highlight the unique opportunities, benefits, and experiences that ${roleName} offers to its users. Emphasize the platform's value proposition, such as access to a vast music library, personalized recommendations, exclusive content, community features, and career opportunities for musicians and creators. Tailor the content to attract potential users and illustrate why ${roleName} stands out among other music streaming platforms.`;
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
            Why Join Us
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
            <div className={cn("text-sm mt-2", !initialData.whyJoinUs && "text-neutral-500 italic")}>
                { initialData.whyJoinUs
                    ? <EditorPreview value={initialData.whyJoinUs} /> 
                    : "No Information" 
                }
            </div>)
        }
        {
            isEditing && (
                <>
                <p className='text-xs mb-2'>Note<span className='text-destructive'>*</span> Type the name of company to generate why Join Us</p>
                <div className="flex flex-col sm:flex-row items-center gap-2  w-full my-3">
                    <Input onChange={(event) => setRoleName(event.target.value)} value={roleName} className='flex-1' disabled={isPrompting} placeholder='Why do you want to join us'  />
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
                            name='whyJoinUs'
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

export default WhyJoinUs
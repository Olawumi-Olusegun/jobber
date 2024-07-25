"use client";

import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combox-box';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import { Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface CompanyFormProps {
    initialData: Job;
    jobId: string;
    options: { label: string, value: string}[]
}

const CompanyFormSchema = z.object({
    companyId: z.string().trim().min(1)
});

const CompanyForm = ({initialData, jobId, options }: CompanyFormProps) => {
    
    const [isEditing, setIsEditing] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof CompanyFormSchema>>({
        resolver: zodResolver(CompanyFormSchema),
        defaultValues: {
            companyId: initialData?.companyId || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleFormSubmit = async (values: z.infer<typeof CompanyFormSchema>) => {
        try {
            await axios.patch(`/api/jobs/${jobId}`, values);
            toast.success("Company updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const toggleEditing = () => setIsEditing((prevState) => !prevState)
    const selectedOption = options.find((option) => option.value=== initialData.companyId);

  return (
    <div className='mt-4 border bg-neutral-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between mb-2">
            Job Created By:
            <Button variant={"ghost"} onClick={toggleEditing}>
                {isEditing 
                ? "Cancel" 
                : <>
                    <Pencil className='w-4 h-4 mr-2' />
                    Edit
                  </>
                }
            </Button>
        </div>
        {
            !isEditing && (
            <p className={cn("text-sm mt-2", !initialData.companyId && "text-neutral-500 italic")}>
                { selectedOption?.label || "No Category" }
            </p>)
        }
        {
            isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className='flex flex-col gap-y-3'>
                        <FormField  
                         control={form.control}
                         name='companyId'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Combobox options={options} heading='Companies' {...field} /> 
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
            )
        }
    </div>
  )
}

export default CompanyForm
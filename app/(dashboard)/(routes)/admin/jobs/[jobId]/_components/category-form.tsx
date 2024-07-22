"use client";

import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combox-box';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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

interface CategoryFormProps {
    initialData: Job;
    jobId: string;
    options: { label: string, value: string}[]
}

const CategoryFormSchema = z.object({
    categoryId: z.string().trim().min(1)
});

const CategoryForm = ({initialData, jobId, options }: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof CategoryFormSchema>>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleTitleFormSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
        try {
            const { data } = await axios.patch(`/api/jobs/${jobId}`, values);
            toast.success("Job category updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const toggleEditing = () => setIsEditing((prevState) => !prevState)
    const selectedOption = options.find((option) => option.value=== initialData.categoryId);

  return (
    <div className='mt-4 border bg-neutral-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between mb-2">
            Job Category
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
            <p className={cn("text-sm mt-2", !initialData.categoryId && "text-neutral-500 italic")}>
                { selectedOption?.label || "No Category" }
            </p>)
        }
        {
            isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleTitleFormSubmit)} className='flex flex-col gap-y-3'>
                        <FormField  
                         control={form.control}
                         name='categoryId'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Combobox options={options} heading='Categories' {...field} /> 
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

export default CategoryForm
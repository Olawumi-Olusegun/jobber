"use client";

import { Button } from '@/components/ui/button';
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

interface HourlyRateFormProps {
    initialData: Job;
    jobId: string;
}

const HourlyRateFormSchema = z.object({
    hourlyRate: z.string().trim().min(1)
});

const HourlyRateForm = ({initialData, jobId }: HourlyRateFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof HourlyRateFormSchema>>({
        resolver: zodResolver(HourlyRateFormSchema),
        defaultValues: {
            hourlyRate: initialData?.hourlyRate || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleHourlyRateFormSubmit = async (values: z.infer<typeof HourlyRateFormSchema>) => {
        try {
            const { data } = await axios.patch(`/api/jobs/${jobId}`, values);
            toast.success("Job hourly rate updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const toggleEditing = () => setIsEditing((prevState) => !prevState)
   

  return (
    <div className='mt-4 border bg-neutral-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between mb-2">
            Hourly Rate
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
            <p className={cn("text-sm mt-2", !initialData.hourlyRate && "text-neutral-500 italic")}>
                { initialData?.hourlyRate ? `$${initialData?.hourlyRate}/hr` : `$0/hr` }
            </p>)
        }
        {
            isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleHourlyRateFormSubmit)} className='flex flex-col gap-y-3'>
                        <FormField  
                         control={form.control}
                         name='hourlyRate'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input type='number' min={"0"} placeholder='Enter hourly rate' {...field} /> 
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

export default HourlyRateForm
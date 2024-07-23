
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

interface WorkModeFormProps {
    initialData: Job;
    jobId: string;
}

let options = [
    {
        value: "remote",
        label: "Remote",
    },
    {
        value: "hybrid",
        label: "Hybrid",
    },
    {
        value: "office",
        label: "Office",
    },
]

const WorkModeModeFormSchema = z.object({
    workMode: z.string().trim().min(1)
});

const WorkModeModeForm = ({initialData, jobId }: WorkModeFormProps) => {
    
    const [isEditing, setIsEditing] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof WorkModeModeFormSchema>>({
        resolver: zodResolver(WorkModeModeFormSchema),
        defaultValues: {
            workMode: initialData?.workMode || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleWorkModeFormSubmit = async (values: z.infer<typeof WorkModeModeFormSchema>) => {
        try {
            const { data } = await axios.patch(`/api/jobs/${jobId}`, values);
            toast.success("Job work mode updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const toggleEditing = () => setIsEditing((prevState) => !prevState)
    const selectedOption = options.find((option) => option.value=== initialData.workMode);

  return (
    <div className='mt-4 border bg-neutral-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between mb-2">
            Work Mode
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
            <p className={cn("text-sm mt-2", !initialData.workMode && "text-neutral-500 italic")}>
                { selectedOption?.label || "No Work Mode" }
            </p>)
        }
        {
            isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleWorkModeFormSubmit)} className='flex flex-col gap-y-3'>
                        <FormField  
                         control={form.control}
                         name='workMode'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Combobox options={options} heading='Work Mode' {...field} /> 
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

export default WorkModeModeForm
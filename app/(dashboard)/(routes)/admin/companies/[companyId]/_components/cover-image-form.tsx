"use client";

import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company } from '@prisma/client';
import axios from 'axios';
import { ImageIcon, Loader2, Pencil } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface CompanyCoverImageFormProps {
    initialData: Company;
    companyId: string;
}

const CompanyCoverImageFormSchema = z.object({
    coverImage: z.string().min(1)
});


const CompanyCoverImageForm = ({initialData, companyId}: CompanyCoverImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof CompanyCoverImageFormSchema>>({
        resolver: zodResolver(CompanyCoverImageFormSchema),
        defaultValues: {
            coverImage: initialData.coverImage || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleFormSubmit = async (values: z.infer<typeof CompanyCoverImageFormSchema>) => {
        try {
            const { data } = await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("Company coverImage updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const toggleEditing = () => setIsEditing((prevState) => !prevState)

  return (
    <div className='mt-4 border bg-neutral-100 rounded-md p-4'>
        <div className="font-medium flex items-center justify-between mb-2 ">
            Cover Image
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
            !isEditing && (!initialData.coverImage
                ? <div className='flex items-center justify-center h-60 bg-neutral-200'>
                    <ImageIcon className='h-10 w-10 text-neutral-500' />
                 </div> 
                : <div className="relative w-full h-60 aspect-video mt-2">
                    <Image src={initialData?.coverImage} alt="Cover Image" fill  sizes='100%' className="object-contain pointer-events-none" /> 
                </div>
            ) 
        }
        {
            isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className='flex flex-col gap-y-3'>
                        <FormField  
                         control={form.control}
                         name='coverImage'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <ImageUpload  
                                     value={field.value}
                                     disabled={isSubmitting}
                                     onChange={(url) => field.onChange(url)}
                                     onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type='submit' disabled={isSubmitting || !isValid}>
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

export default CompanyCoverImageForm
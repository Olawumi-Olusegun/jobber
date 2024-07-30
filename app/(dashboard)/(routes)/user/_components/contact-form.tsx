
"use client";

import Box from '@/components/Box';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile } from '@prisma/client';
import axios from 'axios';
import { Loader2, Pencil, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface ContactFormProps {
    initialData: UserProfile | null;
    userId: string;

}

const ContactFormSchema = z.object({
    contact: z.string().trim().min(1, {message: "Contact number is required"})
});




const ContactForm = ({initialData, userId}: ContactFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof ContactFormSchema>>({
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
            contact: initialData?.contact || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleFormSubmit = async (values: z.infer<typeof ContactFormSchema>) => {
        try {
             await axios.patch(`/api/users/${userId}`, values);
            toast.success("Profile updated");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error((error as any)?.message);
        }
    }

    const toggleEditing = () => setIsEditing((prevState) => !prevState)

  return (
   <Box>
    {
        !isEditing && (
            <div className={cn("text-lg mt-2 flex items-center gap-2", !initialData?.contact && "text-neutral-500 italic")}>
                <Phone className='w-4 h-4 mr-2' />
                {
                   initialData?.contact ? initialData?.contact : "No contact number"
                }
            </div>
        )
    }

            {
                isEditing && (
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className='flex flex-col gap-y-3 flex-1'>
                            <FormField
                            control={form.control}
                            name='contact'
                            render={({field}) => (
                                <FormItem className='flex-1'>
                                    <FormControl>
                                        <Input className='focus-visible:ring-purple-200' placeholder='e.g +234 805 xxx xxx' disabled={isSubmitting} {...field} />
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
            <Button variant={"ghost"} onClick={toggleEditing} className='ml-2 self-stretch'>
                {
                    isEditing 
                    ? <span>Cancel</span> 
                    : <span className='flex items-center gap-x-1.5 flex-nowrap'> <Pencil className='w-4 h-4 ' /> Edit </span>
                }
            </Button>
   </Box>
  )
}

export default ContactForm
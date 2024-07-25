"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company } from '@prisma/client';
import axios from 'axios';
import { Globe, Linkedin, Loader2, Mail, MapPin, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface CompanySocialContactFormProps {
    initialData: Company;
    companyId: string;
}

const CompanySocialContactFormSchema = z.object({
    mail: z.string().trim().min(1, {message: "Mail is required"}),
    website: z.string().trim().min(1, {message: "Website is required"}),
    linkedIn: z.string().trim().min(1, {message: "LinkedIn is required"}),
    address_line_1: z.string().trim().min(1, {message: "Address line 1 is required"}),
    address_line_2: z.string().trim().min(1, {message: "Address line 2 is required"}),
    city: z.string().trim().min(1, {message: "City is required"}),
    state: z.string().trim().min(1, {message: "State is required"}),
    zipcode: z.string().trim().min(1, {message: "Zipcode is required"}),
});




const CompanySocialContactForm = ({initialData, companyId}: CompanySocialContactFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof CompanySocialContactFormSchema>>({
        resolver: zodResolver(CompanySocialContactFormSchema),
        defaultValues: {
            mail: initialData.mail || "",
            website: initialData.website || "",
            linkedIn: initialData.linkedIn || "",
            address_line_1: initialData.address_line_1 || "",
            address_line_2: initialData.address_line_2 || "",
            city: initialData.city || "",
            state: initialData.state || "",
            zipcode: initialData.zipcode || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const handleFormSubmit = async (values: z.infer<typeof CompanySocialContactFormSchema>) => {
        try {
            await axios.patch(`/api/companies/${companyId}`, values);
            toast.success("Company description updated");
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
            Social Media Handles
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
            !isEditing && <div className={cn("grid grid-cols-3 gap-2 mt-2", !initialData.description && "text-neutral-500 italic")}>
                <div className="col-span-3 flex flex-col gap-y-2">
                    {initialData.mail && <div className=" text-sm text-neutral-500 flex items-center w-full truncate">
                        <Mail className='w-3 h-3 mr-2' /> <span>{initialData.mail}</span>
                        </div> 
                    }
                    {initialData.linkedIn && <Link href={initialData.linkedIn} target='_blank' className=" text-sm text-neutral-500 flex items-center w-full truncate">
                        <Linkedin className='w-3 h-3 mr-2' /> <span>{initialData.linkedIn}</span>
                        </Link> 
                    }
                    {initialData.website && <Link href={initialData.website} target='_blank' className=" text-sm text-neutral-500 flex items-center w-full truncate">
                        <Globe className='w-3 h-3 mr-2' /> <span>{initialData.website}</span>
                        </Link> 
                    }
                </div>
                <div className="col-span-3 flex flex-col gap-y-2">
                {initialData.address_line_1 && <div className="flex items-start gap-2 justify-start w-full truncate">
                        <MapPin className='w-3 h-3 mr-2' /> <div className="">
                            <p className='text-sm text-muted-foreground'>
                                {initialData?.address_line_1}, <br />
                            </p>
                            <p className='text-sm text-muted-foreground'>
                                {initialData?.address_line_2},
                            </p>
                            <p className='text-sm text-muted-foreground'>
                                {initialData?.city}, 
                                {initialData?.state} {" - "} {initialData?.zipcode}, 
                            </p>
                        </div>
                        </div> 
                    }
                </div>
            </div>
        }
        {
            isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className='flex flex-col gap-y-3'>
                        <FormField  
                         control={form.control}
                         name='mail'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder='e.g sample@mail.com'  disabled={isSubmitting} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}
                        />
                        <FormField  
                         control={form.control}
                         name='website'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder='e.g https://www.website.com'  disabled={isSubmitting} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}
                        />
                        <FormField  
                         control={form.control}
                         name='linkedIn'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder='e.g https://linkedin.in/@yourname'  disabled={isSubmitting} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}
                        />
                        <FormField  
                         control={form.control}
                         name='address_line_1'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder='e.g Address line 1'  disabled={isSubmitting} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}
                        />
                        <FormField  
                         control={form.control}
                         name='address_line_2'
                         render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder='e.g Address line 2'  disabled={isSubmitting} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                         )}
                        />

                        <div className="grid grid-col-3 gap-2">
                            <FormField  
                            control={form.control}
                            name='city'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder='City'  disabled={isSubmitting} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField  
                            control={form.control}
                            name='state'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder='State'  disabled={isSubmitting} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField  
                            control={form.control}
                            name='zipcode'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder='Zipcode'  disabled={isSubmitting} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>

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

export default CompanySocialContactForm
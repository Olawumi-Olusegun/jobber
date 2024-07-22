"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {z} from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1, {message: "Job title is required"}),
})

const JobCreatePage = () => {

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
       try {
        const { data } = await axios.post('/api/jobs', values)
        toast.success("Job created successfully")
        router.push(`/admin/jobs/${data.id}`)
       } catch (error) {
        console.log(error)
        toast.success((error as any)?.message)
       }
    }

  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
        <div className="">
            <h1 className='text-2xl'>Create New Job</h1>
            <p className='text-sm text-neutral-500 '>What would you like to name your job? Don{"'"}t worry you can change this later </p>
        
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-8">
                    <FormField
                     control={form.control}
                     name="title"
                     render={({field}) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g Fullstack Developer" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs"/>
                        </FormItem>
                     )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button disabled={isSubmitting} type="button" asChild variant={"outline"} className="disabled:cursor-not-allowed">
                            <Link href={"/admin/jobs"}>Cancel</Link>
                        </Button>
                        <Button disabled={isSubmitting || !isValid} type="submit" className="disabled:cursor-not-allowed">
                            {isSubmitting && <Loader2 size={20} className="animate-spin mr-2" /> } Continue
                        </Button>
                    </div>
                </form>
            </Form>
            
        </div>
    </div>
  )
}

export default JobCreatePage
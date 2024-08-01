import React from 'react'
import Box from '@/components/Box'
import CustomBreadCrumb from '@/components/custom-bread-crumb'
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import NameForm from './_components/name-form';
import prismadb from '@/lib/prismadb';
import EmailForm from './_components/email-form';
import ContactForm from './_components/contact-form';
import ResumeForm from './_components/resume-form';
import { DataTable } from '@/components/ui/data-table';
import { AppliedJobColumns, columns } from './_components/column';
import { format } from 'date-fns';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';


const ProfilePage = async () => {

    const { userId }  = auth();

    const user = await currentUser();

    if(!userId) {
        return redirect("/sign-in")
    }

    let profile = await prismadb.userProfile.findUnique({
        where: { userId },
        include: {
            resumes: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });

    const jobs = await prismadb.job.findMany({
        where: { userId },
        include: {
            company: true,
            category: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const filteredAppliedJobs = profile && profile?.appliedJobs.length > 0 
                                ? jobs.filter((job) => profile.appliedJobs.some((appliedJob) => appliedJob.jobId === job.id)).map((job) => ({ ...job, appliedAt: profile.appliedJobs.find((appliedJob) => appliedJob.jobId === job.id)?.appliedAt}))
                                : [];

    const formattedJobs: AppliedJobColumns[] = filteredAppliedJobs.map((job) => ({ 
                                                id: job.id, 
                                                title: job.title, 
                                                company: job.company ? job.company.name : "N/A", 
                                                category: job.category ? job.category.name : "N/A", 
                                                appliedAt: job.appliedAt ? format(new Date(job.appliedAt), "MMMM, do, yyyy") : "N/A"
                                            }));

    const followedCompanies = await prismadb.company.findMany({
        where: {
            followers: {
                has: userId
            }
        }
    })

  return (
    <div className='flex flex-col p-4 md:p-8 items-center justify-center'>
        <Box className=''>
            <CustomBreadCrumb breadCrumbPage='My Profile' />
        </Box>
        <Box className='flex flex-col p-4 rounded-md border mt-8 w-full space-y-6'>
            {
                user && user.hasImage && (
                    <div className="aspect-square w-24 h-24">
                        <Image src={user.imageUrl} alt='User Profile Image' width={96} height={96} className='rounded-full object-contain object-center' />
                    </div>
                )
            }
            <NameForm initialData={profile} userId={userId} />
            <EmailForm initialData={profile} userId={userId} />
            <ContactForm initialData={profile} userId={userId} />
            <ResumeForm initialData={profile} userId={userId} />
        </Box>
        <Box className='flex-col items-start justify-start mt-12'>
            <h2 className='text-2xl text-muted-foreground font-semibold'>Applied Jobs:</h2>
            <div className="w-full mt-6">
                <DataTable 
                columns={columns}
                searchKey='company'
                data={formattedJobs}
                />
            </div>
        </Box>
        <Box className='flex-col items-start justify-start mt-12'>
            <h2 className='text-2xl text-muted-foreground font-semibold'>Followed Companies:</h2>
            <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-2">
                {
                    followedCompanies.length  === 0 
                    ? <p >No company followed yet!</p>
                    : followedCompanies.map((company) => (
                        <Card key={company.id} className='p-3 space-y-2 relative '>
                            <div className="w-full flex items-center justify-end">
                                <Button asChild variant={"ghost"} size={"icon"} className='h-8 w-8'>
                                    <Link href={`/companies/${company.id}`}>
                                        <Eye className='w-4 h-4' />
                                    </Link>
                                </Button>
                            </div>
                        { company?.logo && (
                            <div className="aspect-square w-max bg-white h-32 rounded-2xl border flex items-center justify-center relative overflow-hidden p-3">
                                <Image 
                                 src={company?.logo}
                                 alt={`${company?.name}-logo`}
                                 width={120}
                                 height={120}
                                 className="object-contain object-center pointer-events-none"
                                /> 
                            </div>
                        )
                    }
                            <CardTitle>{company?.name}</CardTitle>
                            {
                                company.description && (
                                    <CardDescription className='line-clamp-3'>
                                        {company.description}
                                    </CardDescription>
                                )
                            }
                        </Card>
                    ))
                }
            </div>
        </Box>
    </div>
  )
}

export default ProfilePage
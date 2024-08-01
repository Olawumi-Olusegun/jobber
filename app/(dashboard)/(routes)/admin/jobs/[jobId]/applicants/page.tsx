import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import { ApplicantsColumns, columns } from './_components/columns';
import { format } from 'date-fns';
import Box from '@/components/Box';
import CustomBreadCrumb from '@/components/custom-bread-crumb';
import { DataTable } from '@/components/ui/data-table';

const JobApplicantsPage = async ({params}: {params: { jobId: string; }}) => {

    const { userId } = auth();

    if(!userId){
        return redirect('/sign-in');
    }

    const job = await prismadb.job.findUnique({
        where: {
            id: params.jobId,
            userId
        }
    });

    if(!job) {
        return redirect('/admin/jobs');
    }

    const [userProfiles, jobs] = await Promise.all([
        prismadb.userProfile.findMany({
            include: {
                resumes: {
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        }),

        prismadb.job.findMany({
            where: { userId },
            include: {
                company: true,
                category: true,
            },
            orderBy: {
                createdAt: "asc"
            }
        })

    ])

    const filteredUserProfiles = userProfiles && userProfiles.filter((profile) => profile.appliedJobs.some((appliedJob) => appliedJob.jobId === params.jobId))

    const formatedProfiles: ApplicantsColumns[] = filteredUserProfiles.map((profile) => ({
        id: profile.userId,
        fullname: profile.fullName ?? "N/A",
        email: profile.email ?? "N/A",
        contact: profile.contact ?? "N/A",
        resume: profile.resumes.find((resume) => resume.id === profile.activeResumeId)?.url ?? "N/A",
        resumeName: profile.resumes.find((resume) => resume.id === profile.activeResumeId)?.name ?? "N/A",
        appliedAt: profile.appliedJobs.find((job) => job.jobId === params.jobId)?.appliedAt
                 ? format(new Date(profile.appliedJobs.find((job) => job.jobId === params.jobId)?.appliedAt ?? ""), "MMMM do, yyyy")
                 : ""
    }));

  return (
    <>
     <div className="flex flex-col p-4 md:p-8 items-center justify-center">
        <Box className=''>
            <CustomBreadCrumb 
             breadCrumbPage='Applicants'
             breadCrumbItem={[
                {link: "/admin/jobs", label: "Jobs"},
                {link: "/admin/jobs", label: `${job.title || ""}`},
             ]}
            />
        </Box>
        <div className="mt-6 w-full">
            <DataTable 
             columns={columns}
             data={formatedProfiles}
             searchKey='fullName'
            />
        </div>
     </div>
    </>
  )
}

export default JobApplicantsPage
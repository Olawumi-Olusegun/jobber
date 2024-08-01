import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import JobDetailsPageContent from '../_components/Job-details-page-content';
import { getJobs } from '@/actions/get-jobs';
import { Separator } from '@/components/ui/separator';
import Box from '@/components/Box';
import PageContent from '../_components/page-content';

const JobDetailsPage = async ({params: { jobId }}: {params: {jobId: string;}}) => {

    const { userId } = auth();

    if(!userId) {
        return redirect("/sign-in")
    }

    if(!jobId) {
        return redirect("/search")
    }

    const job = await prismadb.job.findUnique({
        where: { id: jobId },
        include: {
            company: true,
            attachments: true,
        }
    });

    if(!job) {
        return redirect("/search");
    }

    const userProfile = await prismadb.userProfile.findUnique({
        where: {
            userId: userId as string,
        },
        include: {
            resumes: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });

    const jobs = await getJobs({});

    const filterJobs = jobs.filter((item) => item.id !== job?.id && item.categoryId === job?.categoryId);


  return (
    <div className='flex flex-col p-4 md:p-8 '>
        <JobDetailsPageContent job={job} userProfile={userProfile} jobId={jobId} />

        {
            filterJobs && filterJobs.length > 0 && (
                <>
                 <Separator />
                 <Box className="flex flex-col my-4 items-start justify-start px-4 gap-2">
                    <h2 className="text-lg font-semibold">Related Jobs:</h2>
                 </Box>

                 <PageContent jobs={filterJobs} userId={userId} />

                </>
            )
        }
    </div>
  )
}

export default JobDetailsPage

import { getJobs } from '@/actions/get-jobs';
import Box from '@/components/Box';
import CustomBreadCrumb from '@/components/custom-bread-crumb';
import SearchContainer from '@/components/SearchContainer';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import PageContent from '../search/_components/page-content';

interface SavedJobsPageProps {
    searchParams: {
        title: string;
        categoryId: string;
        createdAtFilter: string;
        shiftTiming: string;
        workMode: string;
        yearsOfExperience: string;
    }
}

const SavedJobsPage = async({searchParams}: SavedJobsPageProps) => {
    
    const { userId } = auth();

    if(!userId) {
        return redirect("/sign-in")
    }

    const jobs = await getJobs({ ...searchParams, savedJobs: true })

  return (
    <div className='flex flex-col'>
        <Box className='my-4 items-center justify-start gap-2 px-2 '>
            <CustomBreadCrumb 
             breadCrumbPage='Saved Jobs'
            />
        </Box>
        <Box className='w-full h-44 bg-purple-600/20 justify-center'>
            <h2 className="font-sans uppercase text-3xl tracking-wider font-bold">Saved Jobs</h2>
        </Box>
        <div className="px-6 pt-6 md:mb-0">
            <SearchContainer />
        </div>
        <div className="p-4">
            <PageContent jobs={jobs} userId={userId} />
        </div>
    </div>
  )
}

export default SavedJobsPage
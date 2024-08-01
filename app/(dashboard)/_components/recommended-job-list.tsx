"use client";

import Box from '@/components/Box';
import { Job } from '@prisma/client';
import React from 'react'
import PageContent from '../(routes)/search/_components/page-content';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RecommendedJobListProps {
    jobs: Job[];
    userId: string | null;
}

const RecommendedJobList = ({jobs, userId}: RecommendedJobListProps) => {
  return (
    <>
        <Box className='flex-col justify-center gap-y-4 my-6 mt-12' >
        <h2 className="text-2xl tracking-wider font-bold font-sans">
            Recommended Jobs
        </h2>
        <div className="mt-4 ">
            <PageContent jobs={jobs} userId={userId} />
        </div>
        <Button variant={"outline"} asChild className='mt-8 w-44 h-12 border-purple-500 hover:bg-transparent text-purple-500 hover:text-purple-600 duration-300 rounded-xl ' >
            <Link href={"/search"}>
                View All Jobs
            </Link>
        </Button>
        </Box>
    </>
  )
}

export default RecommendedJobList
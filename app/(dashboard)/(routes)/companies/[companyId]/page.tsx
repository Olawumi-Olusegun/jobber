
import { getJobs } from '@/actions/get-jobs';
import Box from '@/components/Box';
import CustomBreadCrumb from '@/components/custom-bread-crumb';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'
import CompanyDetailContentPage from '../_components/company-detail-content';

const CompanyDetailPage = async ({ params }: { params: { companyId: string; } }) => {

    const { userId } = auth();

    if(!params.companyId) {
        return redirect("/")
    }

    if(!userId) {
        return redirect("/")
    }

    const company = await prismadb.company.findUnique({
        where: { id: params.companyId }
    });

    if(!company) {
        return redirect("/")
    }

    const jobs = await prismadb.job.findMany({
        where: { companyId: params.companyId },
        include: {
            company: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    })


  return (
    <div className='flex flex-col'>
        <Box className='my-4 items-center justify-start gap-2 px-2'>
            <CustomBreadCrumb
             breadCrumbItem={[{ label: "Search", link: "/search" }]}
             breadCrumbPage={company.name || ""}
            />
        </Box>
        {
            company.coverImage && (

                <div className="w-full flex items-center justify-center overflow-hidden relative h-80 -z-10">
                    <Image  
                     src={company.coverImage}
                     alt={`${company.name}-cover-image`}
                     fill
                     className='w-full h-full object-cover'
                    />
                </div>
            )
        }

        <CompanyDetailContentPage userId={userId} company={company} jobs={jobs} />
        
    </div>
  )
}

export default CompanyDetailPage
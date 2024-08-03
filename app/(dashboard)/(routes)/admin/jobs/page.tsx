
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { columns, JobsColumns } from './_components/columns'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prismadb from '@/lib/prismadb'
import { format } from "date-fns"

const JobsPageOverview = async () => {

  const { userId } = auth();

  if(!userId) {
    return redirect("/sign-in");
  }

  const jobs = await prismadb.job.findMany({
    where: { userId },
    include: {
      category: true,
      company: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });


  const formatedJobs: JobsColumns[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company ? job.company.name : "",
    category: job.category?.name ?? "N/A",
    isPublished: job.isPublished,
    createdAt: job.createdAt ? format(job.createdAt, 'MMMM do, yyyy') : "N/A",
  }))

  return (
    <div className='p-6'>
        <div className="flex items-end justify-end">
            <Button asChild>
                <Link href={"/admin/create"}>
                    <Plus className='w-5 h-5 mr-2' /> 
                    <span>New Job</span>
                </Link>
            </Button>
        </div>
        <div className="mt-6 ">
          <DataTable searchKey='title' columns={columns} data={formatedJobs} />
        </div>
    </div>
  )
}

export default JobsPageOverview

import { Button } from '@/components/ui/button'
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs/server'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { columns, CompanyColumns } from './_components/columns'
import { DataTable } from '@/components/ui/data-table'

const CompaniesOverviewPage = async () => {
    const { userId } = auth();

    if(!userId) {
        return redirect("/");
    }

    const companies = await prismadb.company.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedCompanies: CompanyColumns[] = companies.map((company) => ({
        id: company.id,
        name: company.name ? company.name : "",
        logo: company.logo ? company.logo : "",
        createdAt: company.createdAt ? format(company.createdAt, "MMMM do, yyyy") : "N/A"
    }))


  return (
    <>
    <div className='p-6'>
        <div className="flex items-end justify-end">
            <Button asChild>
                <Link href={"/admin/companies/create"}>
                    <Plus className='w-5 h-5 mr-2' /> 
                    <span>New Company</span>
                </Link>
            </Button>
        </div>
        <div className="mt-6 ">
          <DataTable searchKey='name' columns={columns} data={formattedCompanies} />
        </div>
    </div>
    </>
  )
}

export default CompaniesOverviewPage
"use client";

import Box from '@/components/Box';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Company } from '@prisma/client';
import Link from 'next/link';
import React from 'react'

interface HomeCompaniesListProps {
    companies: Company[]
}

const CompanyListItemCard = ({company}: {company: Company}) => {
  

    return <Button asChild variant={"outline"} className='p-6 flex items-center gap-2 text-muted-foreground hover:text-purple-500 hover:border-purple-500 cursor-pointer'>
            <Link href={`/companies/${company.id}`}>
                <span className='font-serif font-semibold tracking-wide'>{company.name}</span>
            </Link>
        </Button>
}

const HomeCompaniesList = ({companies}: HomeCompaniesListProps) => {
  return (
    <Box className='flex-col pt-12 pb-12'>
        <h2 className="text-2xl tracking-wider font-bold font-sans">
            Featured companies actively hiring
        </h2>
        <div className="mt-12 w-full flex items-center justify-center flex-wrap gap-2">
            {
                companies.map((company) => (
                    <CompanyListItemCard key={company.id} company={company} />
                ))
            }
        </div>
    </Box>
  )
}

export default HomeCompaniesList
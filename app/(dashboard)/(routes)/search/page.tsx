import { getJobs } from '@/actions/get-jobs';
import SearchContainer from '@/components/SearchContainer';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import React from 'react';
import CategoriesList from './_components/categories-list';
import PageContent from './_components/page-content';


interface SearchProps {
    searchParams: {
        title: string;
        categoryId: string;
        createdAt: string;
        shiftTiming: string;
        yearsOfExperience: string;
        workMode : string;
    }
}

const SearchPage = async ({searchParams}: SearchProps) => {

    const { userId  } = auth();
    const categories = await prismadb.category.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })

    const jobs = await getJobs({...searchParams})


  return (
    <>
        <div className="px-6 pt-6 block md:hidden md:mb-0">
            <SearchContainer /> 
        </div>
        <div className="p-6">
            <CategoriesList categories={categories} /> 
            <PageContent userId={userId} jobs={jobs} /> 
        </div>
    </>
  )
}

export default SearchPage
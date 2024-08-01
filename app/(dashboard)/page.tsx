import { getJobs } from '@/actions/get-jobs';
import Box from '@/components/Box';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import HomeSearchContainer from './_components/home-search-container';
import Image from 'next/image';
import HomeScreenCategoriesContainer from './_components/home-screen-categories-container';
import HomeCompaniesList from './_components/home-companies-list';
import RecommendedJobList from './_components/recommended-job-list';
import { Footer } from './_components/footer';

const DashboardHomePage = async () => {
  const { userId } = auth();

  if(!userId) {
    return redirect("/sign-in");
  }

  const jobs = await getJobs({});

  const categoriesPromise = prismadb.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  const companiesPromise = prismadb.company.findMany({
    where: {
      userId: userId as string,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const [categories, companies] = await Promise.all([categoriesPromise, companiesPromise]);


  return (
    <div className='flex flex-col py-3 px-4 space-y-2'>
      <Box className='flex-col justify-center w-full space-y-4 '>
        <h2 className='text-2xl md:text-4xl font-sans font-bold tracking-wide text-neutral-600'>Find your dream job now</h2>
        <p className="text-2xl text-muted-foreground">
          {jobs.length} + jobs for you to explore
        </p>
      </Box>
      <HomeSearchContainer /> 
      <Box className='relative overflow-hidden h-64 justify-center rounded-lg mt-6'>
        <Image 
          src={"/images/job-portal-banner.jpg"}
          alt='Job portal banner'
          fill
          className='object-cover w-full h-full my-5 rounded-lg pointer-events-none' 
        />
      </Box>
      <HomeScreenCategoriesContainer categories={categories} />
      <HomeCompaniesList companies={companies} /> 
      <RecommendedJobList jobs={jobs.splice(0, 6)} userId={userId} /> 
      <Footer />
    </div>
  )
}

export default DashboardHomePage
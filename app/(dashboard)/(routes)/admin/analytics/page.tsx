
import { getTotalCompaniesOnPortal, getTotalCompaniesOnPortalByUserId, getTotalJobsOnPortal, getTotalJobsOnPortalByUserId } from '@/actions/get-overview-analytics'
import Box from '@/components/Box'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { auth } from '@clerk/nextjs/server'
import { BriefcaseBusiness } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const DashboardAnalyticsPage = async () => {
    const { userId } = auth();

    if(!userId) {
        return redirect("/sign-in")
    }

    const totalJobsOnPortal = await getTotalJobsOnPortal();
    const totalJobsOnPortalByUser = await getTotalJobsOnPortalByUserId(userId);

    const totalCompaniesOnPortal = await getTotalCompaniesOnPortal();
    const totalCompaniesOnPortalByUser = await getTotalCompaniesOnPortalByUserId(userId);

  return (
    <>
        <Box className='flex-col items-start p-4'>
            <div className="flex flex-col items-start">
                <h2 className='font-sans tracking-wider font-bold text-2xl'>Dashboard</h2>
                <p className="text-sm text-muted-foreground">Overview of your account</p>
            </div>
            <Separator className='my-4' />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full">
                <Card>
                    <CardHeader className='flex items-center justify-between flex-row '>
                        <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                        <BriefcaseBusiness className='w-5 h-5' />
                    </CardHeader>
                    <CardContent className='text-2xl font-bold'>
                        {totalJobsOnPortal}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex items-center justify-between flex-row '>
                        <CardTitle className="text-sm font-medium">Total Jobs By User</CardTitle>
                        <BriefcaseBusiness className='w-5 h-5' />
                    </CardHeader>
                    <CardContent className='text-2xl font-bold'>
                        {totalJobsOnPortalByUser}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex items-center justify-between flex-row '>
                        <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                        <BriefcaseBusiness className='w-5 h-5' />
                    </CardHeader>
                    <CardContent className='text-2xl font-bold'>
                        {totalCompaniesOnPortal}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex items-center justify-between flex-row '>
                        <CardTitle className="text-sm font-medium">Total Companies By User</CardTitle>
                        <BriefcaseBusiness className='w-5 h-5' />
                    </CardHeader>
                    <CardContent className='text-2xl font-bold'>
                        {totalCompaniesOnPortalByUser}
                    </CardContent>
                </Card>

            </div>
        </Box>
    </>
  )
}

export default DashboardAnalyticsPage
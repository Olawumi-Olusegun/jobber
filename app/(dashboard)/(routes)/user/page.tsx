import React from 'react'
import Box from '@/components/Box'
import CustomBreadCrumb from '@/components/custom-bread-crumb'
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import NameForm from './_components/name-form';
import prismadb from '@/lib/prismadb';
import EmailForm from './_components/email-form';
import ContactForm from './_components/contact-form';
import ResumeForm from './_components/resume-form';


const ProfilePage = async () => {

    const { userId }  = auth();

    const user = await currentUser();

    if(!userId) {
        return redirect("/sign-in")
    }

    let profile = await prismadb.userProfile.findUnique({
        where: { userId },
        include: {
            resumes: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });

  return (
    <div className='flex flex-col p-4 md:p-8 items-center justify-center'>
        <Box className=''>
            <CustomBreadCrumb breadCrumbPage='My Profile' />
        </Box>
        <Box className='flex flex-col p-4 rounded-md border mt-8 w-full space-y-6'>
            {
                user && user.hasImage && (
                    <div className="aspect-square w-24 h-24">
                        <Image src={user.imageUrl} alt='User Profile Image' width={96} height={96} className='rounded-full object-contain object-center' />
                    </div>
                )
            }
            <NameForm initialData={profile} userId={userId} />
            <EmailForm initialData={profile} userId={userId} />
            <ContactForm initialData={profile} userId={userId} />
            <ResumeForm initialData={profile} userId={userId} />
        </Box>
    </div>
  )
}

export default ProfilePage
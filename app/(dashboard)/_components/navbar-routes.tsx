"use client";
import SearchContainer from '@/components/SearchContainer';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const NavbarRoutes = () => {

    const pathname = usePathname();

    const isAdminPage = pathname?.startsWith("/admin");
    const isJobsPage = pathname?.startsWith("/jobs");

  return (
    <>
    {
      isAdminPage && (
        <div className="hidden md:flex w-full pl-60 px-2 pr-8 items-center gap-x-6">
          <SearchContainer />
        </div>
      )
    }
     <div className="flex gap-x-2 ml-auto">
        {
            isAdminPage || isJobsPage
            ? <Button asChild variant={"outline"} size={"sm"} className='border-purple-700/20'>
                <Link href={"/"}>
                    <LogOut size={16} className='mr-1' /> <span>Exit</span>
                </Link>
              </Button>
            : <Button asChild variant={"outline"} size={"sm"} className='border-purple-700/20 px-2'>
                <Link href={"/admin/jobs"}>
                    Admin Mode
                </Link>
              </Button>
        }
        <UserButton />
     </div>
    </>
  )
}

export default NavbarRoutes
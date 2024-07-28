"use client";

import { BookMarked, Compass, Home, List, LucideProps, Router, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import SidebarRouteItem from './sidebar-route-item';
import Box from '@/components/Box';
import { Separator } from '@/components/ui/separator';
import DateFilter from './date-filter';
import CheckBoxContainer from './checkbox-container';
import queryString from 'query-string';


export interface AdminRouteProps {
    id: number;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    label: string;
    href: string;
}

const adminRoutes = [
    {
        id: 1,
        icon: List,
        label: "Jobs",
        href: "/admin/jobs"
    },
    {
        id: 2,
        icon: List,
        label: "Companies",
        href: "/admin/companies"
    },
    {
        id: 3,
        icon: Compass,
        label: "Analytics",
        href: "/admin/analytics"
    },
];

const guestRoutes = [
    {
        id: 1,
        icon: Home,
        label: "Home",
        href: "/"
    },
    {
        id: 2,
        icon: Compass,
        label: "Search",
        href: "/search"
    },
    {
        id: 3,
        icon: User,
        label: "Profile",
        href: "/user"
    },
    {
        id: 4,
        icon: BookMarked,
        label: "Saved Jobs",
        href: "/saved-jobs"
    },
];


const shiftTimingsData = [
    {
      value: "full-time",
      label: "Full Time",
    },
    {
      value: "part-time",
      label: "Part Time",
    },
    {
      value: "contract",
      label: "Contract",
    },
  ];

const workingModesData = [
    {
      value: "remote",
      label: "Remote",
    },
    {
      value: "hybrid",
      label: "Hybrid",
    },
    {
      value: "office",
      label: "Office",
    },
  ];
  
const experienceData = [
    {
      value: "0",
      label: "Fresher",
    },
    {
      value: "2",
      label: "0-2 years",
    },
    {
      value: "3",
      label: "2-4 years",
    },
    {
      value: "5",
      label: "5+ years",
    },
  ];

const SidebarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();

    const isAdminRoute = pathname?.startsWith("/admin");

    const isSearchPage = pathname?.startsWith("/search");

    const routes = isAdminRoute ? adminRoutes : guestRoutes;

    const handleShiftTimingChange = (shiftTiming: string[]) => {
        const currentQueryString = queryString.parseUrl(window.location.href).query;
        const updatedQueryParams = {
            ...currentQueryString,
            shiftTiming,
        }

        const url = queryString.stringifyUrl({
            url: pathname,
            query: updatedQueryParams,
        }, {skipNull: true, skipEmptyString: true});

        router.push(url)

    }

    const handleWorkMode = (workMode: string[]) => {
        const currentQueryString = queryString.parseUrl(window.location.href).query;
        const updatedQueryParams = {
            ...currentQueryString,
            workMode,
        }

        const url = queryString.stringifyUrl({
            url: pathname,
            query: updatedQueryParams,
        }, {skipNull: true, skipEmptyString: true, arrayFormat: "comma"});

        router.push(url)

    }

    const handleExperience = (yearsOfExperience: string[]) => {
        const currentQueryString = queryString.parseUrl(window.location.href).query;
        const updatedQueryParams = {
            ...currentQueryString,
            yearsOfExperience,
        }

        const url = queryString.stringifyUrl({
            url: pathname,
            query: updatedQueryParams,
        }, {skipNull: true, skipEmptyString: true, arrayFormat: "comma"});

        router.push(url)

    }

  return (
    <div className='flex flex-col w-full '>
        {routes.map((route) => (
            <SidebarRouteItem key={route.href} route={route} />
        ))}

        {
            isSearchPage && (
                <Box className='px-4 py-4 flex flex-col items-start justify-start space-y-4 '>
                    <Separator />
                    <h2 className='text-base font-semibold text-muted-foreground tracking-wide'>Filter</h2>
                    <DateFilter />
                    <Separator />

                    <h2 className='text-base font-semibold text-muted-foreground tracking-wide'>Working Schedule</h2>
                    <CheckBoxContainer 
                    onChange={handleShiftTimingChange} 
                    data={shiftTimingsData} 
                    />
                    <Separator />

                    <h2 className='text-base font-semibold text-muted-foreground tracking-wide'>Working Mode</h2>
                    <CheckBoxContainer 
                    onChange={handleWorkMode} 
                    data={workingModesData} 
                    />
                    <Separator />

                    <h2 className='text-base font-semibold text-muted-foreground tracking-wide'>Years of Experience</h2>
                    <CheckBoxContainer 
                    onChange={handleExperience} 
                    data={experienceData} 
                    />
                    


                </Box>
            )
        }
    </div>
  )
}

export default SidebarRoutes
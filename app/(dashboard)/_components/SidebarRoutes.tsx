"use client";

import { BookMarked, Compass, Home, List, LucideProps, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react'
import SidebarRouteItem from './sidebar-route-item';


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

const SidebarRoutes = () => {
    const pathname = usePathname();

    const isAdminRoute = pathname?.startsWith("/admin");

    const routes = isAdminRoute ? adminRoutes : guestRoutes;

  return (
    <div className='flex flex-col w-full '>
        {routes.map((route) => (
            <SidebarRouteItem key={route.href} route={route} />
        ))}
    </div>
  )
}

export default SidebarRoutes
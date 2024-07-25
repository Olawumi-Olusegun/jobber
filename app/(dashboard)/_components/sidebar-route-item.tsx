"use client";

import { AdminRouteProps } from './SidebarRoutes'
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const SidebarRouteItem = ({route}:{route: AdminRouteProps}) => {
    const { icon: Icon, href, label } = route;

    const pathname = usePathname();
    const isActive = pathname == href || pathname.startsWith(`${href}/`)


  return (
    <Button asChild variant={"ghost"} className={cn(" p-0 pl-4 rounded-none items-center justify-start gap-x-2 text-neutral-500 text-sm font-medium transition-all hover:text-neutral-600 hover:bg-neutral-300/20 w-full", 
        isActive && "text-purple-700 bg-purple-200/20 hover:bg-purple-700/20 hover:text-purple-700"
    )}> 
        <Link href={href} className=''>
            <Icon size={22} className={cn("text-neutral-500", isActive && "text-purple-700")} /> 
            <span>{label}</span>
            <div className={cn("ml-auto opacity-0 border-2 border-purple-700  h-full transition-all", isActive && "opacity-100")} />
        </Link>
    </Button>
  )
}

export default SidebarRouteItem
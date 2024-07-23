
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { MenuIcon } from 'lucide-react'
import Sidebar from './sidebar'


const MobileSidebar = () => {
  return (
    <>
    <Sheet>
    <SheetTrigger className='lg:hidden pr-4 hover:opacity-75 transition'>
        <MenuIcon />
    </SheetTrigger>
    <SheetContent side={"left"} className='bg-white p-0'>
        <Sidebar />
    </SheetContent>
    </Sheet>

    </>
  )
}

export default MobileSidebar
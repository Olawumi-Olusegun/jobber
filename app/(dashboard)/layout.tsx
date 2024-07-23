import React, { type ReactNode } from 'react'
import Navbar from './_components/navbar'
import Sidebar from './_components/sidebar'


const DashboardLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='h-dvh'>
        <header className='h-20  fixed inset-y-0 w-full z-50'>
            <Navbar />
        </header>
        <aside className='hidden lg:flex flex-col fixed inset-y-0 z-50 h-dvh w-56'>
          <Sidebar />
        </aside>
        <main className='lg:ml-56  pt-20 h-dvh'>
            {children}
        </main>
    </div>
  )
}

export default DashboardLayout
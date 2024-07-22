import React from 'react'
import Logo from './Logo'
import SidebarRoutes from './SidebarRoutes'

const Sidebar = () => {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white '>
      <div className='w-max'>
        <Logo />
      </div>
      <div className="flex flex-col gap-y-2 w-full">
        <SidebarRoutes />
      </div>
    </div>
  )
}

export default Sidebar

import React, { type ReactNode } from 'react'

const AuthLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='h-dvh flex items-center justify-center'>
        {children}
    </div>
  )
}

export default AuthLayout
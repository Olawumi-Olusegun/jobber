import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="p-6">
        <Image src={"/images/logo.webp"} alt='logo' height={30} width={60} className='w-auto h-auto' />
      </div>
    </Link>
  )
}

export default Logo
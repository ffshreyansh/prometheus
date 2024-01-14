import { UserButton } from '@clerk/nextjs'
import React from 'react'
import MobileSidebar from './mobile-sidebar'
import { getUserApiLimit } from '@/lib/api-limits'

const Navbar = async () => {
    const limit = await getUserApiLimit();
    return (
        <div className="flex items-center p-4">
            <div className="flex w-full justify-between md:justify-end lg:justify-end">
                <MobileSidebar limit={limit}/>
                <UserButton afterSignOutUrl="/" showName={true}/>
            </div>
        </div>
    )
}

export default Navbar
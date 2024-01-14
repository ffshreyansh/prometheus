import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { getUserApiLimit } from '@/lib/api-limits'
import React from 'react'

const DashboardLayour = async ({ children }) => {

    const apiLimit = await getUserApiLimit();

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
                <Sidebar limit={apiLimit} />
            </div>
            <main className='md:pl-72'>
                <Navbar />
                {children}
            </main>
        </div>
    )
}

export default DashboardLayour
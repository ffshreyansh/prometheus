'use client'
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from './sidebar'


const MobileSidebar = ({limit}) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        setIsMounted(true);
    },[])

    if(!isMounted){
        return null;
    }
    return (

        <Sheet>
            <SheetTrigger>
                <Button variant='ghost' size='icon' className='md:hidden'>
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className='p-0'>
                <Sidebar limit={limit} />
            </SheetContent>
        </Sheet>

    )
}

export default MobileSidebar
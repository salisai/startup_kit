import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

const layout = async ({children}: {children: React.ReactNode}) => {
    const {userId} = await auth();
    
    if(!userId) redirect("/signin")

    return (
        <>{children}</>
    )
}

export default layout
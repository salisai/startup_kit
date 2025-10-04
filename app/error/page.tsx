"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const REDIRECT_DELAY = 5000;

const ErrorPage = () => {
    const router = useRouter()
    const [countdown, setCountdown] = useState(REDIRECT_DELAY/1000);

    useEffect(() => {
        const interval = setInterval(()=> {
            setCountdown((prev) => (prev > 1? prev - 1: 0))
        }, 1000);

        const timeout = setTimeout(() => {
            router.push("/");
        }, REDIRECT_DELAY);

        return () => {
            clearTimeout(timeout),
            clearInterval(interval)
        };
    },[router])

  return (
    <div className="container mx-auto p-4 max-w-3xl min-h-screen flex items-center justify-center">
        <Card className='w-full' role='alert' aria-live='assertive'>
            
            <CardHeader>
                <CardTitle className='text-2xl font-bold text-center flex items-center justify-center'>
                    <AlertTriangle className='mr-2 h-6 w-6 text-destructive'/>
                    Oops! Something went wrong
                </CardTitle>
            </CardHeader>

            <CardContent className='text-center'>
                <p className='text-muted-foreground mb-4'>
                    We encountered an unexpected error. Do not worry we are working to fix it. 
                </p>

                <p className="text-muted-foreground">
                    Redirecting you to the homepage in{" "}
                    <span className="font-semibold">{countdown}</span> second
                    {countdown !== 1 && "s"}.
                </p>

                <Button onClick={() => router.push("/")} className='w-full sm:w-auto'>
                    Go to Home Page 
                </Button>

            </CardContent>
        </Card>
    </div>
  )
}

export default ErrorPage
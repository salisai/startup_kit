"use client";

import React, { useState } from 'react'
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


const Signup = () => {
    const {isLoaded, signUp, setActive} = useSignUp()
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()

    if(!isLoaded){
        return null;//loader here
    }

    async function submit(e: React.FormEvent){
        e.preventDefault()

        if(!isLoaded){
            return;
        }

        try {
            //create acount
            await signUp.create({
                emailAddress,
                password
            })

            //trigger verification
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            });

            //switch to verification form
            setPendingVerification(true)
        } catch (error: any) {
            console.log(JSON.stringify(error, null, 2))
            setError(error.errors?.[0]?.message || "Something went wrong. Please try again")
    }

    async function onPressVerify(e: React.FormEvent) {
        e.preventDefault()
        if(!isLoaded){
            return
        } 

        try {
            //try verifying the code
            const completeSignup = await signUp.attemptEmailAddressVerification({code})

            if(completeSignup.status === "complete"){
                await setActive({session: completeSignup.createdSessionId})
                router.push("/dashboard")
            } else {
                console.log(JSON.stringify(completeSignup, null, 2))
            }

        } catch (err: any) {
                console.log(JSON.stringify(err, null, 2));
                setError(err.errors?.[0]?.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold text-center'>
                        Sign up for the app
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {!pendingVerification ? (
                        <form onSubmit={submit} className='space-y-4'>
                                
                                <div className='space-y-2'>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                        type='email'
                                        id='email'
                                        value={emailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                        >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                        </button>
                                    </div>
                                </div>


                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button type='submit' className='w-full'>
                                    Sign up
                                </Button>
                        </form>

                        // In case of verification code
                    ) : (
                        <form onSubmit={onPressVerify} className='space-y-4'> 
                            <div className='space-y-2'>
                                <Label htmlFor='code'>Verification Code</Label>
                                <Input
                                    id='code'
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder='Enter verification code'
                                    required
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type='submit' className='w-full'>
                                Verify Email
                            </Button>
                        </form>
                    )}
                </CardContent>

                <CardFooter className='justify-center'>
                    <p className='text-sm text-muted-foreground'>
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className='font-medium text-primary hover:underline'
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )}
}

export default Signup;
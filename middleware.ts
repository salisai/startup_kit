import { clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server';


const publicRoutes = createRouteMatcher([
  "/",
  "/about",
  "/pricing",
  "/signup(.*)",
  "/signin(.*)",
]);

//will add admin later

const protectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/api/tasks(.*)",
  "/api/ai(.*)",
])


export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn} = await auth();
  const path = req.nextUrl.pathname;


  //if user if not signed in and route is protected, force login
  if(!userId && protectedRoutes(req)){
    return redirectToSignIn()
  }

  //if user is signed in, automatically take them to their dashbaord
  if(userId && publicRoutes(req)){
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  //otherwise, continue as normal
  return NextResponse.next();
})


export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // skip internal Next.js assets / static files
    "/", 
    "/(api|trpc)(.*)"
  ],
};
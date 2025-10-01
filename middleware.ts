import { clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server';


const publicRoutes = createRouteMatcher([
  "/",
  "/api/webhooks/register",
  "/signup(.*)",
  "/signin(.*)"
]);

const adminOnlyRoutes = createRouteMatcher([
  "/admin(.*)"
])

const protectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)"
])

export default clerkMiddleware(async(auth, req) => {
  const { userId, redirectToSignIn} = await auth();

  const path = req.nextUrl.pathname;

  //if user if not signed in and route is protected, force login
  if(!userId && protectedRoutes(req)){
    return redirectToSignIn()
  }

  //if user is signed in 
  if(userId){
    //fetch metadata (role etc)
    let role: string | undefined = undefined;
    
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      role = user.publicMetadata.role as string | undefined;
    
    } catch (error) {
      console.error("Error fetching user in middleware: ", error)
      //force logout
      return NextResponse.redirect(new URL("/error", req.url));
    }


    //if user tries to got to an admin route but they aren't admin
    if(adminOnlyRoutes(req) && role != "admin"){
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    //if user is admin and they go to /dashboard, redirect them to admin dashboard
    if(path === "/dashboard" && role === "admin"){
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    //if the route is public and user is logged in, redirect to their "home"
    if (publicRoutes(req)) {
      const target = role === "admin" ? "/admin/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(target, req.url));
    }  
  }

  //if nothing special, allow request to continue 
  return NextResponse.next();
})


export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // skip internal Next.js assets / static files
    "/", 
    "/(api|trpc)(.*)"
  ],
}
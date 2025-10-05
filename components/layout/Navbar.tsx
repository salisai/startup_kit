"use client";

import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, CreditCard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@/components/ui/avatar";

import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";


export default function Navbar() {
  const { user } = useUser();//current logged-in user 
  const { signOut } = useClerk();
  const pathname = usePathname();//current path
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    {name: "Home", href: "/"},
    {name: "Dashboad", href: "/dashboard", protected: true},
    {name: "Pricing", href: "/pricing"},
    {name: "About", href: "/about"}
  ]

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            TodoMaster
          </Link>

          {/* desktop nav links */}
          <div>
            {navLinks
              .filter((link) => !link.protected || user)//it not protected or user is logged-in
              .map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx("text-sm font-medium transition-colors hover:text-primary", pathname===link.href ? "text-primary" : "text-muted-foreground")}
                >
                  {link.name}
                </Link>
              ))
            }
          </div>

          {/* user actions, all user buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={user.imageUrl} alt="User avatar" />
                      <AvatarFallback>
                        {/* show user name first letter if no image */}
                        {user.firstName?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link href="/subscribe" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Subscribe</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:block">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>

                {/* mobile menu button */}
                <Button 
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  onClick={() => setIsOpen(!isOpen)}//this will toggle the menu in mobile mode.
                >
                  <Menu className="h-5 w-5"/>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* mobile navbar */}
        {isOpen && (
          <div className="sm:hidden mt-2 space-y-2 border-t pt-2">
            {navLinks
              .filter((link) => !link.protected || user)
              .map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx("block text-sm px-3 py-2 rounded-md transition-colors hover:bg-accent", pathname===link.href ? "text-primary fond-semibold" : "text-muted-foreground")}
                >
                  {link.name}
                </Link>
              ))
            }

            {!user && (
              <>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
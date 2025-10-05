"use client"

import React from 'react'
import Link from 'next/link'
import {Github, Twitter, Facebook, Linkedin} from "lucide-react"
import { FOOTER_LINKS } from '../config/footer-links'
import { Separator } from "@/components/ui/separator"

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-muted/50 border-t py-10 mt-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* top section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div>
                    <Link href="/" className='flex items-center space-x-2'>
                        <img src="/logo.svg" alt="logo" className='h-8 w-8' />
                        <span className='mt-4 text-sm text-muted-foreground max-w-x5'>NextStart</span>
                    </Link>

                    <p className='mt-4 text-sm text-muted-foreground max-w-xs'>
                        Building the future of web apps - fast, scalable, and intelligent.
                    </p>

                     {/* Social Icons */}
                    <div className="flex mt-4 space-x-4">
                        <a
                            href="https://github.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                        <a
                            href="https://twitter.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a
                            href="https://facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a
                            href="https://linkedin.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                {/* footer links */}
                {FOOTER_LINKS.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-sm font-semibold mb-3 text-foreground/90 uppercase tracking-wider">
                            {section.title}
                        </h3>

                        <ul className='space-y-2'>
                            {section.links.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='text-sm text-muted-foreground hover:text-primary transition-colors'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <Separator className='my-6'/>

            {/* bottom section */}
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; {currentYear} Startup. All rights reserved.</p>
                
                <div className="flex space-x-4 mt-3 sm:mt-0">
                    <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms
                    </Link>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
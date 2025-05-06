'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { IUser } from '@/app/auth/page';
import { motion, AnimatePresence } from "framer-motion"
import { Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Menu, X } from 'lucide-react';

export function Navbar() {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname();
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  useEffect(() => {
    const verifyToken = async () => {
      const res = await fetch('http://localhost:4000/verify-token', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const response = await res.json()
      if(res.ok) setCurrentUser(response)
      console.log(currentUser)
    }
    verifyToken()
  }, [])
  async function signOut(){
    const res = await fetch('http://localhost:4000/sign-out' , {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(res.ok){
        setCurrentUser(null)
        router.push('/auth')
    }
  }
  async function resetHourlyLimit(){
    if(currentUser !== null){
      await fetch('http://localhost:4000/hourly-reset', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: currentUser.id})
      })
      console.log('token refreshed')
    }
  }
  useEffect(() => {
    if(currentUser !== null){
      const timeout = setInterval(() => {
        resetHourlyLimit()
      }, 60 * 60 * 1000);
      return () => clearInterval(timeout)
    }
  }, [currentUser])

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Buster</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-gray-700 hover:text-blue-600 transition-colors ${isActive("/") ? "text-blue-600" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/features"
              className={`text-gray-700 hover:text-blue-600 transition-colors ${
                isActive("/features") ? "text-blue-600" : ""
              }`}
            >
              Features
            </Link>
            <Link
              href="/faq"
              className={`text-gray-700 hover:text-blue-600 transition-colors ${
                isActive("/faq") ? "text-blue-600" : ""
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`text-gray-700 hover:text-blue-600 transition-colors ${
                isActive("/contact") ? "text-blue-600" : ""
              }`}
            >
              Contact
            </Link>
            {currentUser == null ? (
              <div className="flex gap-4">
                <Button className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                  Sign up
                </Button>
                <Link href="/auth">
                  <Button
                    variant="secondary"
                    className="inline-flex items-center px-6 py-3 rounded-lg transition-colors"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/chat"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Start Chat
                </Link>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-9 w-9 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <motion.div 
                        whileHover={{ rotate: 30 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <Settings className="h-5 w-5" />
                      </motion.div>
                    </Button>
                  </DropdownMenuTrigger>
                  <AnimatePresence>
                    {open && (
                      <DropdownMenuContent forceMount align="end" asChild className="w-48">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <DropdownMenuItem asChild>
                            <Link href="/settings" className="flex items-center cursor-pointer">
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Settings</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={signOut} 
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/settings" className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              <span className='font-semibold'>{currentUser.name}</span>
                            </Link>
                          </DropdownMenuItem>
                        </motion.div>
                      </DropdownMenuContent>
                    )}
                  </AnimatePresence>
                </DropdownMenu>
                <Avatar className="h-11 w-11 border-2 border-muted">
                  {currentUser?.profileImage ? (
                    <>
                      <AvatarImage src={currentUser.profileImage} />
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                        <User />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                        <User />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </Link>
              <Link
                href="/features"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/features') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Features
              </Link>
              <Link
                href="/faq"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/faq') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/contact') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Contact
              </Link>
              {currentUser == null ? (
                <div className="space-y-1">
                  <Link href="/auth">
                    <Button className="w-full justify-center bg-blue-600">
                      Sign up
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button variant="secondary" className="w-full justify-center">
                      Sign in
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/chat"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Start Chat
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
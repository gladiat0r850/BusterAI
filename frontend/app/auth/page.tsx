"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Lock, User, ArrowRight, Brain, LoaderCircle, AlertCircle } from "lucide-react"
import generateID from "@/hooks/generate-id"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export interface IUser {
  name?: string
  password?: string
  email?: string
  id?: string
  chatHistory?: { role: string; content: string; time: Date; id: number }[]
  profileImage?: string,
  hourlyLimit?: number
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState<IUser>({
    name: undefined,
    password: undefined,
    email: undefined,
    id: "",
    profileImage: "",
    hourlyLimit: 10
  })
  const [loginUser, setCredentials] = useState<IUser>({ email: undefined, password: undefined })
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleNewUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await fetch("http://localhost:4000/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, id: generateID() }),
      })
      if (res.ok) setIsLogin(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await fetch(`http://localhost:4000/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginUser),
        credentials: "include",
      })

      if (res.ok) {
        router.push("/")
      } else {
        toast({
          variant: "default",
          title: 'Authentication failed',
          description: "The email or password you entered is incorrect. Please try again.",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "default",
        title: 'Authentication failed',
        description: "Unable to connect to the server. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function verifyToken(){
      const res = await fetch('http://localhost:4000/verify-token', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
      
        const response: IUser = await res.json();
        setCurrentUser(response);
      }
      verifyToken()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    isLogin ? handleLogin(e) : handleNewUser(e)
  }

  return <>
  <Toaster />
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-blue-600" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? (
              <>
                New to Buster?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                  disabled={isLoading}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin ? (
              <>
                {/* — SIGN‑UP FORM — */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="pl-10 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="pl-10 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      className="pl-10 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* — LOGIN FORM — */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginUser.email}
                      onChange={(e) => setCredentials({ ...loginUser, email: e.target.value })}
                      className="pl-10 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={loginUser.password}
                      onChange={(e) => setCredentials({ ...loginUser, password: e.target.value })}
                      className="pl-10 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <div className="flex items-center justify-end">
                <Link href="/auth/reset-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className={`${
                isLoading && "opacity-50"
              } disabled:cursor-default w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors`}
              disabled={isLoading}
            >
              {isLogin ? "Sign in" : "Create account"}
              {!isLoading ? (
                <ArrowRight className="ml-2 h-5 w-5" />
              ) : (
                <LoaderCircle className="text-white animate-spin ml-2 h-5" />
              )}
            </button>
          </form>
        </motion.div>

        <div className="text-center text-sm text-gray-600">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  </>
}

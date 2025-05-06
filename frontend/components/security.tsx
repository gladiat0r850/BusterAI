"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { IUser } from "@/app/auth/page"
import { useRouter } from "next/navigation"
import { Toaster } from "./ui/toaster"
import { useToast } from "@/hooks/use-toast"
export function SecuritySettings() {
  const [passwords, setPasses] = useState({
    password: '',
    newPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {toast} = useToast()

  const verifyToken = async () => {
      const res = await fetch('http://localhost:4000/verify-token', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
    
      const response: IUser = await res.json();
      setCurrentUser(response);
  
      if(response === null){
        router.push('/auth')
      }
  }
  useEffect(() => {
    async function TokenCheck(){
      await verifyToken()
    }
    TokenCheck()
  }, [])

  async function changePassword(id: string){
    setIsLoading(true)
    try{
      await fetch(`http://localhost:4000/change-password/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...passwords, id: currentUser?.id})
      })
      setPasses({password: '', newPassword: ''})
      toast({
        variant: "default",
        title: 'Succesfully changed your password!',
        description: "Be sure to remember it when signing in!",
      })
    }catch(error){
      console.log(error)
      toast({
        variant: "default",
        title: 'Password update failed.',
        description: "Something went wrong.",
      })
    }
    finally{
      setIsLoading(false)
    }
  }
  useEffect(() => {
    console.log(isLoading)
  }, [isLoading])

  return <>
  <Toaster />
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              value={passwords.password}
              onChange={(e) => setPasses({...passwords, password: e.target.value})}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) => setPasses({...passwords, newPassword: e.target.value})}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isLoading || currentUser?.password == passwords.newPassword || passwords.newPassword.length < 8} onClick={() => currentUser?.id && changePassword(currentUser?.id)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">{!isLoading ? 'Update password' : 'Updating password'} {isLoading && <LoaderCircle className="text-white animate-spin ml-2 h-5" />}</Button>
      </CardFooter>
    </Card>
  </>
}

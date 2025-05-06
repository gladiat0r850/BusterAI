"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Upload, LoaderCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IUser } from "@/app/auth/page"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "./ui/toaster"


export function ProfileSettings() {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [username, setUsername] = useState(currentUser?.name)
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const verifyToken = async () => {
    const res = await fetch('http://localhost:4000/verify-token', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await res.json()
    setCurrentUser(response)
    setUsername(response.name)
    setProfileImage(response.profileImage)
    console.log(response)
  }
  useEffect(() => {
    verifyToken()
  }, [])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }
  async function changeProfile(id: string){
    try{
      setIsLoading(true)
      const res = await fetch(`http://localhost:4000/change-profile/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, profileImage})
      })
        const response = await res.json()
        console.log(response)
        setCurrentUser(response)
        toast({
          variant: "default",
          title: 'Success!',
          description: "Your profile has succesfully been updated."
        })
    }catch(error){
      console.error(error)
      toast({
        variant: "default",
        title: 'Profile update failed.',
        description: "Something went wrong.",
      })
    }finally{
      setIsLoading(false)
    }
  }
  return <>
    <Toaster/>
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-2 border-muted">
              <AvatarImage src={profileImage || undefined} />
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                <User size={32} />
              </AvatarFallback>
            </Avatar>

            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              whileHover={{ scale: 1.05 }}
              onClick={handleUploadClick}
            >
              <Upload className="h-8 w-8 text-white" />
            </motion.div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">Click on the avatar to upload a new profile picture.</p>
            <Button variant="outline" size="sm" onClick={handleUploadClick}>
              Upload new image
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <p className="text-sm text-muted-foreground">This is your public display name.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={username?.length <= 4 || isLoading || (currentUser?.name == username && profileImage == currentUser?.profileImage)} onClick={() => currentUser?.id && changeProfile(currentUser?.id)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">{!isLoading ? 'Save changes' : 'Saving changes'} {isLoading && <LoaderCircle className="text-white animate-spin ml-2 h-5" />}</Button>
      </CardFooter>
    </Card>
  </>
}

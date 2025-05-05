"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IUser } from "@/app/auth/page"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DangerZone() {
  const [confirmText, setConfirmText] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const router = useRouter()

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
    
      console.log(response);
    };
  
    useEffect(() => {
        const tokenVerification = async function(){
          await verifyToken()
        }
        tokenVerification()
      }, [])

  async function accountDeletion(id: string){
    const res = await fetch(`http://localhost:4000/account-deletion/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id})
    })
    if(res.ok){
      router.push('/')
      setCurrentUser(null)
    }
  }

  return (
    <Card className="border-red-200">
      <CardHeader className="text-red-600">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <CardTitle>Danger Zone</CardTitle>
        </div>
        <CardDescription className="text-red-600/80">Irreversible and destructive actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-medium">Delete Account</h3>
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="confirm">
                Type <span className="font-semibold">delete my account</span> to confirm
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete my account"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={confirmText !== "delete my account"}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                onClick={() => currentUser?.id && accountDeletion(currentUser?.id)}
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

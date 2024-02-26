/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { socket } from "@/lib/socket"
import uid from "@/lib/uuid"
import { RootState } from "@/redux/store"
import { PlusCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useRef } from "react"
import { useSelector } from "react-redux"



function DocsHome() {

  const router = useRouter()
  const profile = useSelector((state: RootState) => state.Profile_Slice)
  const input = useRef<HTMLInputElement>(null)
  const AdminId = useRef<HTMLInputElement>(null)

  const createNewPlayRoom = useCallback(() => {
    const roomId = uid()
    socket.emit("sketch_create_room_sender", {
      roomId: roomId,
    })
    router.push(`/docs/${roomId}?admin=${socket.id}`)
  }, [router])

  const joinRoom = useCallback(() => {
    const roomId = input.current?.value
    if (roomId) {
      socket.emit("sketch_room_join_req_sender", {
        roomId: roomId,
        userId: profile.user?._id,
        userData: profile.user,
        socketId: socket.id,
        adminId: AdminId.current?.value
      })
    }
  }, [profile.user?._id, router])

  

  return (
    <div className="w-full min-h-screen justify-center items-center flex gap-10 flex-wrap p-2">
      <Card className="w-96 h-60" onClick={createNewPlayRoom}>
        <PlusCircleIcon className="m-auto h-60" size={100} />
      </Card>

      <Card className="w-96 h-60">
        <CardHeader>
          <CardTitle>Painting Room</CardTitle>
          <CardDescription>
            Play painting game with your friends
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="AdminId">Room AdminId</Label>
            <Input id="AdminId" placeholder="Enter room code here" 
              ref={AdminId}
            />
          </div>
        </CardContent>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="roomId">Room Code</Label>
            <Input id="roomId" placeholder="Enter room code here" 
              ref={input}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Button variant="ghost">Cancel</Button>
          <Button onClick={joinRoom}>Join Room</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DocsHome
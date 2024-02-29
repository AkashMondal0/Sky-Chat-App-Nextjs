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
import { useCallback, useContext, useRef } from "react"
import { useSelector } from "react-redux"
import { SketchContext } from "./context"
import queryString from 'query-string';



function DocsHome() {

  const router = useRouter()
  const profile = useSelector((state: RootState) => state.Profile_Slice)
  const input = useRef<HTMLInputElement>(null)
  const sketchState = useContext(SketchContext)

  const createNewPlayRoom = useCallback(() => {
    const roomId = uid()
    socket.emit("sketch_create_room_sender", {
      roomId: roomId,
    })
    if (!profile.user) return
    sketchState.JoinRoomWithAllData?.({
      members: [{
        user: profile.user,
        canvasData: []
      }],
      roomId: roomId,
      AuthorId: socket.id,
      canvasData: [],
    })
    router.push(`/docs/${roomId}?admin=${socket.id}`)
  }, [router])

  const joinRoomRequest = useCallback(() => {

    const { AuthorId, roomId } = queryString.parse(input.current?.value as string)

    if (roomId && profile.user?._id && AuthorId) {
      socket.emit("sketch_room_join_req_sender", {
        roomId: roomId,
        userId: profile.user?._id,
        userData: profile.user,
        socketId: socket.id,
        AuthorId: AuthorId
      })
    }
  }, [profile.user?._id, router])



  return (
    <div className="w-full min-h-screen justify-center items-center flex gap-10 flex-wrap p-2">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sketch Room</CardTitle>
          <CardDescription>
            Play painting game with your friends
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="roomId">Room Code</Label>
            <Input id="roomId" placeholder="Enter room code here"
              ref={input}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Button variant="outline" onClick={createNewPlayRoom}>Create Room</Button>
          <Button onClick={joinRoomRequest}>Join Room</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DocsHome
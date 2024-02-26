/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { socket } from "@/lib/socket"
import { RootState } from "@/redux/store"
import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { createContext } from "react"
import { useSelector } from "react-redux"
import { ReactSketchCanvasRef } from "react-sketch-canvas"
import { Members_Sketch } from "./[docsId]/page"
import { initialToolState, reducer, toolProps } from "./reducer"
import { AvatarToast, GameRequestToast } from "@/components/shared/MyAlert"
import { toast } from "sonner"
import { User, UserType } from "@/interface/type"
import { redirect, useRouter } from "next/navigation"
import { AlertDialogDemo } from "./[docsId]/components/alert-dialog"

interface SketchProviderProps {
    children: React.ReactNode
}
interface SketchContextProps {
    canvas: React.RefObject<ReactSketchCanvasRef>
    tool: toolProps
    members: Members_Sketch[]
    profileState?: UserType | null | undefined
    toggleScreen: (screen: "document" | "Both" | "Canvas") => void
    setTool?: React.Dispatch<React.SetStateAction<toolProps>>
}
export const SketchContext = createContext<SketchContextProps>({
    canvas: React.createRef<ReactSketchCanvasRef>(),
    tool: initialToolState,
    members: [],
    toggleScreen: () => { },
    profileState: undefined,
    setTool: () => { }
})


export function SketchProvider({ children }: SketchProviderProps) {
    const router = useRouter();
    const profileState = useSelector((state: RootState) => state.Profile_Slice.user);
    const canvas = React.useRef<ReactSketchCanvasRef>(null);
    const [tool, setTool] = useReducer(reducer, initialToolState)
    const [members, setMembers] = useState<Members_Sketch[]>([])
    const [alert, setAlert] = useState<{
        open: boolean,
        data: {
            user: User | null,
            socketId: string | null,
            roomId: string | null
        }
    }>({
        open: false,
        data: {
            user: null,
            socketId: null,
            roomId: null
        }
    })

    useEffect(() => {
        function handleResize() {
            setTool({
                type: "CANVAS_SIZE",
                payload: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            })
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function findUserDetails(user: User, socketId: string, roomId: string) {
        setAlert({
            open: true,
            data: {
                user,
                socketId,
                roomId
            }
        })
    }

    useEffect(() => {
        if (!profileState) {
            redirect('/docs')
        } else {
            setMembers([{ user: profileState, canvasData: [] }])
        }
        socket.on('sketch_in_room_sender', (data) => {
            console.log(data, 'data')
            canvas.current?.loadPaths(data);
        })

        socket.on('sketch_user_join_Broadcast_room_receiver', (data) => {
            toast.success(`${data.userData.username} joined the room`)
        })

        socket.on('sketch_room_join_req_receiver', (data) => {
            findUserDetails(data.userData, data.socketId, data.roomId);
        })

        socket.on('following_pointer_receiver', (data) => {
            console.log(data, 'data')
        })

        socket.on('sketch_room_join_answer_receiver', (data) => {
            if (data.type === "DECLINED") {
                toast.error("Room join request declined")
            } else if (data.type === "ACCEPTED") {
                // TODO set all data
                setMembers(data.members)
                socket.emit('sketch_create_room_sender', {
                    roomId: data.roomId,
                    userData: profileState
                })
                router.push(`/docs/${data.roomId}?admin=${data.AuthorId}`)
            }
        })

        return () => {
            socket.off('sketch_in_room_sender');
            socket.off('sketch_room_join_req_receiver');
            socket.off('following_pointer_receiver');
            socket.off('sketch_room_join_answer_receiver');
            socket.off('sketch_user_join_Broadcast_room_receiver');
        }
    }, [])

    const toggleScreen = (screen: "document" | "Both" | "Canvas") => {
        setTool({ type: "TOGGLE", payload: screen })
    }

    return <SketchContext.Provider
        value={{
            canvas,
            tool,
            members,
            toggleScreen,
            profileState,
            setTool
        }}>
        <AlertDialogDemo
            open={alert.open}
            accept={() => {
                const Members = [...members, { user: alert.data.user, canvasData: [] }]
                const roomAllData = {
                    AuthorId: socket.id,
                    members: Members,
                    canvasData: [],
                    receiverId: alert.data.socketId,
                    roomId: alert.data.roomId,
                    type: "ACCEPTED"
                }
                setMembers(Members as Members_Sketch[])
                socket.emit('sketch_room_join_answer_sender', roomAllData);
                setAlert({ ...alert, open: false })
            }}
            decline={() => {
                const roomAllData = {
                    receiverId: alert.data.socketId,
                    type: "DECLINED"
                }
                socket.emit('sketch_room_join_answer_sender', roomAllData);
                setAlert({ ...alert, open: false })
            }}
            data={alert.data.user}
        />
        {children}
    </SketchContext.Provider>
}

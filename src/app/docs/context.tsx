/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { socket } from "@/lib/socket"
import { RootState } from "@/redux/store"
import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { createContext } from "react"
import { useSelector } from "react-redux"
import { ReactSketchCanvasRef } from "react-sketch-canvas"
import { Members_Sketch } from "./[docsId]/page"
import { RoomDataState, initialRoomDataState, initialToolState, reducer, roomReducer, toolProps } from "./reducer"
import { toast } from "sonner"
import { User, UserType } from "@/interface/type"
import { redirect, useRouter } from "next/navigation"
import { AlertDialogDemo } from "./[docsId]/components/alert-dialog"
import _ from "lodash"

interface SketchProviderProps {
    children: React.ReactNode
}

interface SketchContextProps {
    canvas: React.RefObject<ReactSketchCanvasRef>
    tool: toolProps
    members: Members_Sketch[]
    profileState?: UserType | null | undefined
    toggleScreen: (screen: "document" | "Both" | "Canvas") => void
    setTool?: React.Dispatch<React.SetStateAction<toolProps>>,
    sendMyCanvas?: (canvasData: any) => void
    JoinRoomWithAllData?: (data: RoomDataState) => void
}
export const SketchContext = createContext<SketchContextProps>({
    canvas: React.createRef<ReactSketchCanvasRef>(),
    tool: initialToolState,
    members: [],
    toggleScreen: () => { },
    profileState: undefined,
    setTool: () => { },
    sendMyCanvas: () => { },
    JoinRoomWithAllData: () => { }
})


export function SketchProvider({ children }: SketchProviderProps) {
    const router = useRouter();
    const profileState = useSelector((state: RootState) => state.Profile_Slice.user);
    const canvas = React.useRef<ReactSketchCanvasRef>(null);
    const [tool, setTool] = useReducer(reducer, initialToolState)
    const [roomData, setRoomData] = useReducer(roomReducer, initialRoomDataState)

    // sketch room join request alert 
    const NewRequestAlert = useCallback((user: User, socketId: string, roomId: string) => {
        setTool({ type: "ALERT", payload: { open: true, data: { user, socketId, roomId } } })
    }, [])
    const JoinRoomWithAllData = useCallback((data: RoomDataState) => {
        // TODO set all data
        const roomData = {
            members: data.members,
            canvasData: [],
            roomId: data.roomId,
            AuthorId: data.AuthorId
        }
        socket.emit('sketch_create_room_sender', {
            roomId: data.roomId,
            userData: profileState
        })
        setRoomData({ type: "SET_ROOM_DATA", payload: roomData })
        router.push(`/docs/${data.roomId}?admin=${data.AuthorId}`)
    }, [profileState, router])

    const acceptRequest = useCallback(() => {
        const Members = [...roomData.members, { user: tool.alert.data.user, canvasData: [] }]
        const roomAllData = {
            AuthorId: socket.id,
            members: Members,
            canvasData: [],
            receiverId: tool.alert.data.socketId,
            roomId: tool.alert.data.roomId,
            type: "ACCEPTED"
        }
        socket.emit('sketch_room_join_answer_sender', roomAllData);
        setRoomData({ type: "SET_MEMBERS", payload: Members })
        setTool({ type: "ALERT", payload: { open: false, data: { user: null, socketId: null, roomId: null } } })
    }, [roomData.members, tool.alert.data.roomId, tool.alert.data.socketId, tool.alert.data.user])

    const declineRequest = useCallback(() => {
        const roomAllData = {
            receiverId: tool.alert.data.socketId,
            type: "DECLINED"
        }
        socket.emit('sketch_room_join_answer_sender', roomAllData);
        setTool({ type: "ALERT", payload: { open: false, data: { user: null, socketId: null, roomId: null } } })
    }, [tool.alert.data.socketId])

    // TODO: Add the following pointer

    const toggleScreen = (screen: "document" | "Both" | "Canvas") => {
        setTool({ type: "TOGGLE", payload: screen })
    }

    const sendMyCanvas = (canvasData: any) => {
        // console.log(canvasData, 'canvasData')
        socket.emit('sketch_room_load_canvas_data_sender', {
            canvasData: canvasData,
            roomId: roomData.roomId,
            userId: profileState?._id
        })
    }

    const throttledFunction = _.throttle((canvasData) => sendMyCanvas(canvasData), 1000);


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

    useEffect(() => {
        if (!profileState) {
            redirect('/docs')
        }
        socket.on('sketch_user_join_Broadcast_room_receiver', (data) => {
            toast.success(`${data.userData.username} joined the room`)
        })

        socket.on('sketch_room_join_req_receiver', (data) => {
            NewRequestAlert(data.userData, data.socketId, data.roomId);
        })

        socket.on('following_pointer_receiver', (data) => {
            console.log(data, 'data')
        })

        socket.on('sketch_room_join_answer_receiver', (data) => {
            if (data.type === "DECLINED") {
                toast.error("Room join request declined")
            } else if (data.type === "ACCEPTED") {
                JoinRoomWithAllData(data)
            }
        })

        // TODO: Load the canvas data
        socket.on('sketch_room_load_canvas_data_receiver', (data) => {
            canvas.current?.loadPaths(data?.canvasData);
        })


        return () => {
            socket.off('sketch_room_load_canvas_data_receiver');
            socket.off('sketch_room_join_req_receiver');
            socket.off('following_pointer_receiver');
            socket.off('sketch_room_join_answer_receiver');
            socket.off('sketch_user_join_Broadcast_room_receiver');
        }
    }, [])


    return <SketchContext.Provider
        value={{
            canvas,
            tool,
            members: roomData.members,
            toggleScreen,
            profileState,
            setTool,
            sendMyCanvas: throttledFunction,
            JoinRoomWithAllData
        }}>
        <AlertDialogDemo
            open={tool.alert.open}
            accept={acceptRequest}
            decline={declineRequest}
            data={tool.alert.data.user}
        />
        {children}
    </SketchContext.Provider>
}

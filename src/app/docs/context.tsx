/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
"use client"
import { socket } from "@/lib/socket"
import { RootState } from "@/redux/store"
import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { createContext } from "react"
import { useSelector } from "react-redux"
import { ReactSketchCanvasRef } from "react-sketch-canvas"
import { Members_Sketch } from "./[docsId]/page"
import { RoomDataState, getRandomColorPicker, initialRoomDataState, initialToolState, reducer, roomReducer, toolProps } from "./reducer"
import { toast } from "sonner"
import { User, UserType } from "@/interface/type"
import { redirect, useRouter } from "next/navigation"
import { AlertDialogDemo } from "./[docsId]/components/alert-dialog"
import _ from "lodash"
import { FollowPointer } from "./following-pointer"
import Image from "next/image"

interface SketchProviderProps {
    children: React.ReactNode
}

interface CursorUser {
    x: number,
    y: number,
    color?: string,
    user: User,
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
    roomData?: RoomDataState | undefined
    loadCanvas?: () => void
    sendCurrentCursorLocation: (data: { x: number, y: number }) => void
}
export const SketchContext = createContext<SketchContextProps>({
    canvas: React.createRef<ReactSketchCanvasRef>(),
    tool: initialToolState,
    members: [],
    toggleScreen: () => { },
    profileState: undefined,
    setTool: () => { },
    sendMyCanvas: () => { },
    JoinRoomWithAllData: () => { },
    roomData: undefined,
    loadCanvas: () => { },
    sendCurrentCursorLocation: () => { }
})

export function SketchProvider({ children }: SketchProviderProps) {
    const router = useRouter();
    const profileState = useSelector((state: RootState) => state.Profile_Slice.user);
    const canvas = React.useRef<ReactSketchCanvasRef>(null);
    const [tool, setTool] = useReducer(reducer, initialToolState)
    const [roomData, setRoomData] = useReducer(roomReducer, initialRoomDataState)
    const [saveCanvas, setSaveCanvas] = useState<any>([])
    const [cursorLocation, setCursorLocation] = useState<CursorUser[]>([])


    const loadCanvas = useCallback(() => {
        canvas.current?.loadPaths(saveCanvas);
    }, [saveCanvas])

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
        setSaveCanvas(data.canvasData)
        setRoomData({ type: "SET_ROOM_DATA", payload: roomData })
        router.push(`/docs/${data.roomId}?admin=${data.AuthorId}`)
    }, [profileState, router])

    const acceptRequest = useCallback(async () => {
        const Members = [...roomData.members, { user: tool.alert.data.user, canvasData: [] }]
        const roomAllData = {
            AuthorId: socket.id,
            members: Members,
            canvasData: await canvas.current?.exportPaths(),
            receiverId: tool.alert.data.socketId,
            roomId: tool.alert.data.roomId,
            type: "ACCEPTED",
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

    const sendMyCanvas = async (canvasData: any) => {
        socket.emit('sketch_room_load_canvas_data_sender', {
            canvasData: canvasData,
            roomId: roomData.roomId,
            userId: profileState?._id
        })
    }

    const throttledCanvasFunction = _.throttle((canvasData) => sendMyCanvas(canvasData), 1000);

    const sendCurrentCursorLocation = useCallback((data: { x: number, y: number }) => {
        socket.emit('following_pointer_sender', {
            roomId: roomData.roomId,
            location: data,
            userData: {
                _id: profileState?._id,
                username: profileState?.username,
                avatar: profileState?.profilePicture
            }
        })
    }, [roomData.roomId, profileState])

    const setCursorData = useCallback((data: {
        location: { x: number, y: number },
        userData: User
    }) => {
        setCursorLocation((prev) => {
            const updatedCursor = prev.findIndex((item) => item.user._id === data.userData._id)
            if (updatedCursor === -1) {
                return [...prev, {
                    x: data.location.x,
                    y: data.location.y,
                    user: data.userData,
                    color: getRandomColorPicker()
                }]
            } else {
                prev[updatedCursor] = {
                    x: data.location.x,
                    y: data.location.y,
                    user: data.userData,
                    color: prev[updatedCursor].color,
                }
                return [...prev]
            }
        })
    }, [])

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

        // cursor location
        socket.on('following_pointer_receiver', (data) => {
            setCursorData(data)
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
            sendMyCanvas: throttledCanvasFunction,
            JoinRoomWithAllData,
            roomData,
            loadCanvas,
            sendCurrentCursorLocation: sendCurrentCursorLocation
        }}>
        <AlertDialogDemo
            open={tool.alert.open}
            accept={acceptRequest}
            decline={declineRequest}
            data={tool.alert.data.user}
        />
        {/* <FollowPointer
            // key={index}
            x={80}
            y={80}
            color={getRandomColorPicker()}
            data={
                <TitleComponent
                    title={"Akash"}
                    color={getRandomColorPicker()}
                    avatar={""} />
            }
        /> */}
        {cursorLocation.map((item, index) => (
            <FollowPointer
                key={index}
                x={item.x}
                y={item.y}
                color={item.color}
                data={
                    <TitleComponent
                        title={item.user.username}
                        color={item.color}
                        avatar={item.user.profilePicture || ""} />
                }
            />
        ))}
        {children}
    </SketchContext.Provider>
}

const TitleComponent = ({
    title,
    avatar,
    color
}: {
    title: string;
    avatar: string;
    backgroundColor?: string;
    color?: string;
}) => (
    <div
        style={{
            backgroundColor: color,
        }}
        className="flex items-center p-[2px] rounded-full">
        <div className="flex items-center">
            {<AvatarDemo
                src={avatar}
                alt="avatar"
                fallback={title[0]}
            />}
            <p className="px-1">{title}</p>
        </div>
    </div>
);

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function AvatarDemo({
    src,
    alt,
    fallback,
}: {
    src: string;
    alt: string;
    fallback: string;
}) {
    return (
        <Avatar style={{
            width: 25,
            height: 25,
        }}>
            <AvatarImage
                src={src}
                alt={alt}
            />
            <AvatarFallback>
                {fallback}
            </AvatarFallback>
        </Avatar>
    )
}
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { GameRequest, PrivateMessage, PrivateMessageSeen } from "@/interface/type"
import { socket } from "@/lib/socket"
import { GetTokenLocal, Logout } from "@/redux/slices/authentication"
import { addToPrivateChatList, addToPrivateChatListMessage, addToPrivateChatListMessageSeen, addToPrivateChatListMessageTyping, resetPrivateChatList } from "@/redux/slices/conversation"
import { QR_Login, fetchProfileData, resetProfileState } from "@/redux/slices/profile"
import { deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { createContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { GameRequestToast } from "../shared/MyAlert"
import { gameRequestSet } from "@/redux/slices/games"
import { RootState } from "@/redux/store"
import { InGameData } from "@/app/games/[roomId]/page"
import { signOut } from "next-auth/react"

interface ProfileProviderProps {
    children: React.ReactNode
}
interface ProfileContextProps {
    StartApp: (token?: string) => void,
    isConnected?: boolean
    handleQRLogin: (token: string) => void
    Logout: () => void
}
export const ProfileContext = createContext<ProfileContextProps>({
    StartApp: () => { },
    isConnected: false,
    handleQRLogin: () => { },
    Logout: () => { }
})


export function ProfileProvider({ children }: ProfileProviderProps) {
    const dispatch = useDispatch()
    const [isConnected, setIsConnected] = useState(socket.connected);
    const router = useRouter()

    const StartApp = useCallback(async (token?: string) => {
        const _data = token ? token : await GetTokenLocal()
        if (_data) {
            dispatch(fetchProfileData(_data) as any)
        }
    }, [])

    const OffApp = useCallback(async () => {
        dispatch(Logout())
        dispatch(resetProfileState())
        dispatch(resetPrivateChatList())
        signOut()
    }, [])

    const handleQRLogin = useCallback(async (token: string) => {
        await dispatch(QR_Login(token) as any)
        StartApp(token)
    }, [])

    useEffect(() => {
        StartApp()
        socket.on("update_Chat_List_Receiver", async (data) => {
            dispatch(addToPrivateChatList(data.chatData) as any)
        })

        socket.on("message_receiver", (data: PrivateMessage) => {
            dispatch(addToPrivateChatListMessage(data))
        })

        socket.on("message_seen_receiver", (data: PrivateMessageSeen) => {
            dispatch(addToPrivateChatListMessageSeen(data))
        })
        socket.on("message_typing_receiver", (data) => {
            dispatch(addToPrivateChatListMessageTyping(data))
        })

        // game request
        socket.on("incoming_game_request_receiver", (data: GameRequest) => {
            // dispatch(gameRequestSet(data))
            toast.custom((t) => <GameRequestToast data={data} onClick={() => {
                const { receiverData, senderData } = data
                const randomTurn = Math.random() > 0.5 ? "X" : "O"
                const newRespond = {
                    ...data,
                    receiverData: senderData,
                    senderData: receiverData,
                    receiverId: senderData?._id,
                    senderId: receiverData?._id,
                    turn: randomTurn
                }
                router.push(`/games/${data._id}?userId=${newRespond.receiverData?._id}&turn=${randomTurn}`)
                socket.emit("game_request_Answer_sender", newRespond)
                toast.dismiss(t)
            }} />)
        })
        socket.on("game_request_Answer_receiver", (data: GameRequest) => {
            const { receiverData, senderData, turn } = data
          const _turn = turn === "X" ? "O" : "X"
            const startRespond: InGameData = {
                roomId: data._id,
                state: [null, null, null, null, null, null, null, null, null],
                currentTurn: _turn,
                type: "START_GAME",
                firstTurn: "X",
                turnCount: 0,
                senderId: receiverData?._id as string,
                receiverId: senderData?._id as string,
            }
            socket.emit("in_game_sender", startRespond)
            router.push(`/games/${data._id}?userId=${data.senderData?._id}&turn=${_turn}`)
        })

        socket.on("connect", () => {
            setIsConnected(true)
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
        })

        return () => {
            socket.off("update_Chat_List_Receiver")
            socket.off("message_receiver")
            socket.off("message_seen_receiver")
            socket.off("message_typing_receiver")
            socket.off("connect")
            socket.off("disconnect")
            socket.off("incoming_game_request_receiver")
            socket.off("game_request_Answer_receiver")

        }
    }, []);


    return <ProfileContext.Provider
        value={{
            StartApp,
            isConnected,
            handleQRLogin,
            Logout: OffApp
        }}>
        {children}
    </ProfileContext.Provider>
}

/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { PrivateMessage, PrivateMessageSeen } from "@/interface/type"
import { socket } from "@/lib/socket"
import { GetTokenLocal, Logout } from "@/redux/slices/authentication"
import { addToPrivateChatList, addToPrivateChatListMessage, addToPrivateChatListMessageSeen, addToPrivateChatListMessageTyping, resetPrivateChatList } from "@/redux/slices/conversation"
import { QR_Login, fetchProfileData, resetProfileState } from "@/redux/slices/profile"
import { deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import { createContext } from "react"
import { useDispatch } from "react-redux"

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
        deleteCookie('token')
        router.replace('/auth/login')
        router.refresh()
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

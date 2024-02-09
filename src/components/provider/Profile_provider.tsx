/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { GetTokenLocal, Login } from "@/redux/slices/authentication"
import { fetchProfileData } from "@/redux/slices/profile"
import React, { useCallback, useEffect } from "react"
import { createContext } from "react"
import { useDispatch, useSelector } from "react-redux"

interface ProfileProviderProps {
    children: React.ReactNode
}
interface ProfileContextProps {
    StartApp: () => void
}
export const ProfileContext = createContext<ProfileContextProps>({
    StartApp: () => { }
})


export function ProfileProvider({ children }: ProfileProviderProps) {
    const dispatch = useDispatch()

    const StartApp = useCallback(async () => {
        const _data = await GetTokenLocal()
        if (_data) {
            dispatch(fetchProfileData(_data) as any)
        }
    }, [])

    useEffect(() => {
        StartApp()
    }, [])

    return <ProfileContext.Provider
        value={{
            StartApp
        }}>
        {children}
    </ProfileContext.Provider>
}

/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { GetTokenLocal, Login } from "@/redux/slices/authentication"
import { fetchProfileData } from "@/redux/slices/profile"
import { RootState } from "@/redux/store"
import React, { useCallback, useEffect } from "react"
import { createContext } from "react"
import { useDispatch, useSelector } from "react-redux"

interface ProfileProviderProps {
    children: React.ReactNode
}
export const ProfileContext = createContext({})


export function ProfileProvider({ children }: ProfileProviderProps) {
    const Authentication_Slice = useSelector((state: RootState) => state.Authentication_Slice)
    const dispatch = useDispatch()

    const StartApp = useCallback(async () => {
        const _data = await GetTokenLocal()
        if (_data) {
            dispatch(fetchProfileData(_data) as any)
        } else {
            alert("Token not found")
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

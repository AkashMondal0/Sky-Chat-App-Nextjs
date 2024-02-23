/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import SearchModal from "@/components/modal/search_user"
import { Suspense, useCallback, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Bell, Gamepad2 } from 'lucide-react';
import { Private_Chat_State } from "@/redux/slices/conversation";
import { Profile_State } from "@/redux/slices/profile";
import React from "react";
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
    ConversationState: Private_Chat_State
    ProfileState: Profile_State
}


const UserCard = dynamic(() => import('./User-Card'), {
    loading: () => <UserCardLoading />,
})
const UserNav = dynamic(() => import('./user-nav'), {
    loading: () => <Skeleton className="h-12 w-12 rounded-full" />,
})


export default function Sidebar({ ConversationState,
    ProfileState }: SidebarProps) {
    const router = useRouter()
    const asPath = usePathname()

    const ArrangeDateByeDate = useMemo(() => {
        return ConversationState.List
    }, [ConversationState.List])

    const navigateToPage = useCallback((id?: string) => {
        if (asPath !== "/") {
            router.replace(`/${id}`)
        } else {
            router.push(`/${id}`)
        }
    }, [])

    return (
        <div>
            <Card className="col-span-3 border-none">
                <ScrollArea className={`h-[100dvh] w-full md:w-96 scroll-smooth`}>
                    <div className="flex justify-between w-full p-6 items-center">
                        <CardTitle>Sky Chat</CardTitle>
                        <UserNav user={ProfileState.user} />
                    </div>
                    <CardContent className='p-0'>
                        <div className='flex justify-between items-center w-full mb-2 px-4'>
                            <div className='flex gap-1'>
                                <SearchModal />
                                {/* <GroupCreateModal /> */}
                            </div>
                            <div>
                            <Button variant={"ghost"} onClick={() => {
                               
                            }}>
                                <Bell className='w-6 h-6 cursor-pointer' />
                            </Button>
                            <Button variant={"ghost"} onClick={() => {
                                router.push('/games')
                            }}>
                                <Gamepad2 className='w-6 h-6 cursor-pointer' />
                            </Button>
                            </div>
                        </div>
                        <div className='px-2'>
                            {ConversationState.loading && <div>{ConversationState.error}</div>}
                            {ArrangeDateByeDate?.map((item) => {
                                return <UserCard
                                    onclick={() => { navigateToPage(item._id) }}
                                    key={item._id}
                                    conversationData={item}
                                    profile={ProfileState.user as any}
                                    userData={item.userDetails} />
                            })}
                        </div>

                    </CardContent>
                </ScrollArea>
            </Card>
        </div>
    )
}

const UserCardLoading = () => {
    return <div className="flex items-center my-4 py-3 w-full h-auto rounded-2xl px-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="ml-4 space-y-1">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
}
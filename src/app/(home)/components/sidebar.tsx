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
import { Bell, Gamepad2, Paintbrush2Icon } from 'lucide-react';
import { Private_Chat_State } from "@/redux/slices/conversation";
import { Profile_State } from "@/redux/slices/profile";
import React from "react";
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from "next/navigation";
import { PrivateChat, PrivateMessage } from "@/interface/type";
interface CardList {
    type: "private" | "group"
    item: PrivateChat
    // GroupConversation
    name?: string
}
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

    const margeList: CardList[] = useMemo(() => {
        // marge group and private chat list
        const privateList = [...ConversationState.List].map((item) => {
            return {
                type: "private",
                item,
                name: item.userDetails?.username
            }
        })
        // const groupList = [...useGroupChat.groupChatList].map((item) => {
        //     return {
        //         type: "group",
        //         item,
        //         name: item.name
        //     }
        // })

        const sortedNewDate = (messages: PrivateMessage[]) => {
            return messages && [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt
        }

        return [...privateList,
            // ...groupList
        ].sort((a, b) => {
            const _a = a.item.messages && a.item.messages?.length > 0 ? sortedNewDate(a.item.messages) : a.item.createdAt
            const _b = b.item.messages && b.item.messages?.length > 0 ? sortedNewDate(b.item.messages) : b.item.createdAt
            return new Date(_b).getTime() - new Date(_a).getTime()
        })
        // search filter
        // .filter((item) => {
        //     return item.name?.toLowerCase().includes(watch("search").toLowerCase()) || ""
        // })
    }, [ConversationState.List,]) as CardList[]



    return (
        <div>
            <div className="col-span-3 border-none">
                <ScrollArea className={`min-h-[100dvh] w-full md:w-96 scroll-smooth border-r`}>
                    <div>
                        <div className="flex justify-between w-full p-6 items-center">
                            <CardTitle>Sky Chat</CardTitle>
                            <UserNav user={ProfileState.user} />
                        </div>
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
                                    router.push('/docs')
                                }}>
                                    <Paintbrush2Icon className='w-6 h-6 cursor-pointer' />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <CardContent className='p-0'>
                        <div className='px-2'>
                            {ConversationState.loading && <div>{ConversationState.error}</div>}
                            {margeList?.map((item) => {
                                if (item.type === "private") {
                                    return <UserCard key={item.item._id} data={item.item} />
                                }
                            })}
                        </div>

                    </CardContent>
                </ScrollArea>
            </div>
        </div>
    )
}

export const UserCardLoading = () => {
    return <div className="flex items-center my-4 py-3 w-full h-auto rounded-2xl px-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="ml-4 space-y-1">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
}
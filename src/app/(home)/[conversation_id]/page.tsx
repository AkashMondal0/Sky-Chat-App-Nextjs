/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useSearchParams } from 'next/navigation'
import { PrivateChat } from '@/interface/type'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

interface ConversationPageProps {
    params: {
        conversation_id: string
    }
}
const Header = dynamic(() => import('./components/header'), {
    loading: () => <LoadingComponent />
})
const ChatBody = dynamic(() => import('./components/body'), {
    loading: () => <LoadingComponent />
})
const ChatFooter = dynamic(() => import('./components/footer'), {
    loading: () => <LoadingComponent />
})


const ConversationPage = ({
    params: { conversation_id },
}: ConversationPageProps) => {
    const searchQuery = useSearchParams().get("userId")
    const Conversation_Slice = useSelector((state: RootState) => state.Conversation_Slice)
    const { searchUser } = useSelector((state: RootState) => state.Users_Slice)
    const Profile_Slice = useSelector((state: RootState) => state.Profile_Slice)

    const conversation = useMemo(() => {
        if (searchQuery && Profile_Slice.user?._id) {
            const data: PrivateChat = {
                _id: conversation_id,
                users: [searchQuery, Profile_Slice.user._id],
                messages: [],
                userDetails: searchUser.find((user) => user._id === searchQuery),
                createdAt: new Date().toISOString(),
                lastMessageContent: ''
            }
            return data
        }
        else {
            return Conversation_Slice.List.find((conversation) => conversation._id === conversation_id)
        }
    }, [Conversation_Slice.List, conversation_id, searchQuery, searchUser])

    if (!conversation) {
        return <LoadingComponent />
    }

    return (
        <div className={`flex flex-col h-[100dvh] w-full rounded-md border overflow-hidden`}>
            <Header
                profile={Profile_Slice.user || undefined}
                data={conversation} />
            <ChatBody
                profile={Profile_Slice.user || undefined}
                data={conversation} />
            <ChatFooter
                newConversation={searchQuery ? true : false}
                profile={Profile_Slice.user || undefined}
                conversation={conversation} />
        </div>
    )
}

export default ConversationPage

const LoadingComponent = () => {
    return <div className='w-full h-[100dvh] flex flex-col'>
        <div className='flex my-4 mx-2 h-16'>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className='flex flex-col'>
                <Skeleton className="h-5 w-72 m-1" />
                <Skeleton className="h-4 w-52 m-1" />
            </div>
        </div>
        <ScrollArea className="flex-grow px-4 my-2 w-full">
            {Array(14).fill(0).map((_, i) => <div key={i} className="flex flex-col">
                <Skeleton className={`h-12 w-40 rounded-2xl my-2 
            ${Math.floor(Math.random() * 12) > 6 ? "ml-auto" : ""}`} />
            </div>)}
        </ScrollArea>

        <div className='px-5 h-16 sticky bottom-0 z-1 my-2'><Skeleton className="h-10 w-full rounded-3xl" /></div>
    </div>
}
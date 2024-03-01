/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { redirect, useSearchParams } from 'next/navigation'
import { PrivateChat } from '@/interface/type'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import LoadingComponent from './components/LoadingComponent'


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

    if (!conversation && !Profile_Slice && Conversation_Slice.loading) {
      return  <>
            <div className="w-full h-[100dvh] flex items-center justify-center gap-2">
                No Conversation Found <Link href={"/"} className="underline text-blue-500">Go Home</Link>
            </div>
        </>
    }


    return (
        <div className={`flex flex-col h-[100dvh] w-full overflow-hidden`}>
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
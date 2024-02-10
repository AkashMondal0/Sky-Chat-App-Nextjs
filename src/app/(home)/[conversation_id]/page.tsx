/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useMemo } from 'react'
import Header from './components/header'
import ChatBody from './components/body'
import ChatFooter from './components/footer'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useSearchParams } from 'next/navigation'
import { PrivateChat } from '@/interface/type'

interface ConversationPageProps {
    params: {
        conversation_id: string
    }
}
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
        return <div>Conversation not found</div>
    }
    return (
        <div className={`flex flex-col h-[100dvh] w-full rounded-md border overflow-hidden`}>
            <header className="h-16">
                <Header
                    profile={Profile_Slice.user || undefined}
                    data={conversation} />
            </header>
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

/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useMemo } from 'react'
import Header from './components/header'
import ChatBody from './components/body'
import ChatFooter from './components/footer'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface ConversationPageProps {
    params: {
        conversation_id: string
    }
    sideBarChildren?: React.ReactNode
}
const ConversationPage = ({
    params: { conversation_id },
}: ConversationPageProps) => {
    const Conversation_Slice = useSelector((state: RootState) => state.Conversation_Slice)
    const Profile_Slice = useSelector((state: RootState) => state.Profile_Slice)

    const conversation = useMemo(() => {
        return Conversation_Slice.List.find((conversation) => conversation._id === conversation_id)
    }, [Conversation_Slice.List, conversation_id])

    if (!conversation) {
        return <div>Conversation not found</div>
    }
    return (
        <div className="flex w-full">
            <div className={`h-[100dvh] w-full rounded-md border overflow-hidden`}>
                <>
                    <Header data={conversation}
                    // profile={Profile_Slice}
                    />
                    <ChatBody
                        profile={Profile_Slice.user}
                        data={conversation} />
                    <ChatFooter
                        // profile={Profile_Slice}
                        data={conversation} />
                </>
            </div>
        </div>
    )
}

export default ConversationPage
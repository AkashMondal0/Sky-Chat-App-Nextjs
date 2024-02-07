"use client"
import { FC, useEffect, useMemo, useRef } from 'react';
import MessagesCard from './message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PrivateChat, PrivateMessage, User } from '@/interface/type';
import { List, ScrollSync } from 'react-virtualized';

interface ChatBodyProps {
    data: PrivateChat | undefined
    profile: User | undefined | null
}

const ChatBody: FC<ChatBodyProps> = ({
    data,
    profile
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const user = data?.userDetails

    const messages = useMemo(() => {
        // dummy data
        return Array.from({ length: 1000 }, (_, i) => ({
            _id: i,
            content: `message ${i}`,
            createdAt: new Date(),
            senderId: user?._id,
            seen: false
        }))

    }, [data?.messages])

    if (!profile) {
        return <div>User not found</div>
    }

    return (
        <>
            <ScrollSync>
                {({ onScroll, scrollLeft, scrollTop }) => (
                    <>
                        <List id='style-1'
                            autoWidth
                            className='w-full min-h-screen'
                            width={300}
                            height={900}
                            rowCount={messages.length}
                            rowHeight={60}
                            rowRenderer={({ index, key, style }) => {
                                const message = messages[index]
                                return (
                                    <div key={key} style={style}>
                                        <MessagesCard
                                            data={message}
                                            profile={message.senderId === profile._id}
                                            seen={message.seen}
                                        />
                                    </div>
                                )
                            }}
                        />
                    </>
                )}
            </ScrollSync>
        </>
    );
};

export default ChatBody;





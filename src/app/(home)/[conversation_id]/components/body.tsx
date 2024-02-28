/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { FC, Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import MessagesCard from './message';
import { PrivateChat, PrivateMessageSeen, User } from '@/interface/type';
import { sendMessageSeenPrivate } from '@/redux/slices/conversation';
import { useDispatch } from 'react-redux';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingComponent } from '../page';


interface ChatBodyProps {
    data: PrivateChat | undefined
    profile: User | undefined | null
}

const ChatBody: FC<ChatBodyProps> = ({
    data,
    profile
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()


    const list = useMemo(() => {
        if (!data?.messages) return []
        return [...data?.messages].sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
    }, [data?.messages])

    const seenCount = useMemo(() => {
        if (!data?.messages) return []
        return [...data?.messages].map(item => {
            if (!item.seenBy.includes(profile?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined)
    }, [data?.messages])

    const messageSeen = useCallback(() => {
        const seen: PrivateMessageSeen = {
            messageIds: seenCount as string[],
            memberId: profile?._id as string,
            receiverId: data?.userDetails?._id as string,
            conversationId: data?._id as string
        }
        dispatch(sendMessageSeenPrivate({ seen }) as any)
    }, [data?.messages])

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })

        if (seenCount.length > 0) {
            messageSeen()
        }
    }, [data?.messages])

    if (!data) {
        return <LoadingComponent />
    }

    if (!profile) {
        return <LoadingComponent />
    }

    return (
        <Suspense>
            <div className='flex-1 overflow-y-auto px-2' id='style-1'>
                {list.map((item, index) => {
                    const seen = item.seenBy.includes(profile._id) && item.seenBy.length >= 2
                    return <MessagesCard
                        key={index}
                        data={item}
                        seen={seen}
                        profile={profile}
                    />
                })}
                <div ref={ref}></div>
            </div>
        </Suspense>
    );

};

export default ChatBody;



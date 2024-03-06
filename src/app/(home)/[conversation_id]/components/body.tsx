/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import MessagesCard from './message';
import { Assets, PrivateChat, PrivateMessage, PrivateMessageSeen, User } from '@/interface/type';
import { sendMessageSeenPrivate } from '@/redux/slices/conversation';
import { useDispatch } from 'react-redux';
import LoadingComponent from './LoadingComponent';


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
        <>
            <div className='flex-1 overflow-y-auto px-2' id='style-1'>
                {list.map((item, index) => {
                    const seen = item.seenBy.includes(profile._id) && item.seenBy.length >= 2
                    if (item.fileUrl) {
                        return <FileComponent
                            key={index}
                            seen={seen}
                            data={item}
                            profile={profile} />
                    }
                    return <MessagesCard
                        key={index}
                        data={item}
                        seen={seen}
                        profile={profile}
                    />
                })}
                <div ref={ref}></div>
            </div>
        </>
    );

};

export default ChatBody;


const FileComponent = ({
    data,
    seen,
    profile
}: {
    data: PrivateMessage,
    seen: boolean,
    profile: User
}) => {
    const isProfile = data.memberId === profile._id
    return <div className={`my-3 flex items-center ${isProfile ? "justify-end" : " justify-start"}`}>
        <div className=''>
            {
                data?.fileUrl?.map((asset, index) => {
                    if (asset.type === "image") {
                        return <div key={index}>
                            <img key={index} src={asset.url} alt="" className={`object-cover h-60 w-48 rounded-3xl mb-2`} />
                        </div>
                    }
                    if (asset.type === "video") {
                        return <video src={asset.url} controls key={index} className={`object-cover h-60 w-48 rounded-3xl mb-2`} />
                    }
                    if (asset.type === "audio") {
                        return <audio key={index} src={asset.url} controls className={`object-cover h-60 w-48 rounded-3xl mb-2`} />
                    }
                    return <div key={index} className='bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 p-2 rounded-3xl'>
                        {asset.caption}
                    </div>
                })
            }
        </div>
    </div>
}
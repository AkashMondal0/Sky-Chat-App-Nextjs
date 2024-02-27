/* eslint-disable react-hooks/exhaustive-deps */
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PrivateChat, PrivateMessage, User } from '@/interface/type';
import { useCallback, useMemo } from 'react';
import { timeFormat } from '@/lib/timeFormat';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface UserCardProps {
    data: PrivateChat
}

const UserCard = ({
    data
}: UserCardProps) => {
    const profile = useSelector((state: RootState) => state.Profile_Slice.user)
    const searchParam = useSearchParams().get('conversation_id')
    const id = data._id
    const router = useRouter()
    const asPath = usePathname() 
    const userData = data.userDetails

    const navigateToPage = useCallback(() => {
        if (asPath !== "/") {
            router.replace(`/${id}`)
        } else {
            router.push(`/${id}`)
        }
    }, [])
    // count unseen messages
    const unseenMessages = useMemo(() => {
        return data.messages?.map(item => {
            if (!item.seenBy.includes(profile?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined) || []
    }, [profile?._id, data.messages])

    const sortedNewDate = (messages: PrivateMessage[]) => {
        return messages && [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    }


    const title = userData?.username as string
    const avatarUrl = userData?.profilePicture
    const lastMessage = data.messages && data.messages.length > 0 ? sortedNewDate(data?.messages)?.content : "New friend"
    const date = data.messages && data.messages.length > 0 ? sortedNewDate(data?.messages).createdAt : data.createdAt
    const isTyping = data?.typing

    if (!data.userDetails) return null

    return <Button onClick={navigateToPage}
        variant={"ghost"}
        className={`${searchParam === id && "bg-accent"} flex items-center py-3 w-full h-auto rounded-2xl my-3`}
        key={data._id}>
        <div className={`flex w-full items-center`}>
            <Avatar className="h-12 w-12">
                <AvatarImage src={avatarUrl} alt="Avatar" />
                <AvatarFallback className='text-lg'>{title[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-base leading-none text-start font-semibold w-48 truncate">{title}</p>
                <p className="text-sm text-muted-foreground text-start w-48 truncate">
                    {isTyping ? "typing..." : lastMessage || "No messages yet"}
                </p>
            </div>
        </div>
        <div className='w-20'>
            <div className="ml-auto font-medium">
                {timeFormat(date) || "00:00"}
            </div>
            {searchParam !== id && unseenMessages.length > 0 ?
                <div className='rounded-full bg-black dark:bg-white mx-auto my-1
            text-white dark:text-black w-6 h-6 flex justify-center items-center'>
                    {unseenMessages.length || 0}
                </div> : <div className='w-6 h-6' />}
        </div>
    </Button>
}

export default UserCard;
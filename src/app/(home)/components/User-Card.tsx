/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PrivateChat, PrivateMessage, User } from '@/interface/type';
import { useCallback, useMemo } from 'react';
import { timeFormat } from '@/lib/timeFormat';

interface UserCardProps {
    userData: User | any
    conversationData: PrivateChat
    profile?: User | undefined
}

const UserCard = ({
    userData,
    conversationData,
    profile
}: UserCardProps) => {
    const router = useRouter()
    const searchParam = useSearchParams().get('conversation_id')
    const navigate = useCallback((id?: string) => {
        router.replace(`/${id}`)
    }, [])
    const id = conversationData._id

    // count unseen messages
    const unseenMessages = useMemo(() => {
        return conversationData.messages?.map(item => {
            if (!item.seenBy.includes(profile?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined) || []
    }, [profile?._id, conversationData.messages])

    if (!userData) return null

    return <Button onClick={() => navigate(id)}
        variant={"ghost"}
        className={`${searchParam === id && "bg-accent"} flex items-center py-3 w-full h-auto rounded-2xl my-3`}
        key={conversationData._id}>
        <div className={`flex w-full items-center`}>
            <Avatar className="h-12 w-12">
                <AvatarImage src={userData.profilePicture} alt="Avatar" />
                <AvatarFallback className='text-lg'>{userData.username[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-base leading-none text-start font-semibold w-48 truncate">{userData.username}</p>
                <p className="text-sm text-muted-foreground text-start w-48 truncate">
                    {conversationData.typing ? "typing..." : conversationData.lastMessageContent || "No messages yet"}
                </p>
            </div>
        </div>
        <div className='w-20'>
            <div className="ml-auto font-medium">
                {timeFormat(conversationData?.updatedAt as any) || "00:00"}
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
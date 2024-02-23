/* eslint-disable @next/next/no-img-element */
'use client'
import { cn } from '@/lib/utils';
import { FC, useMemo } from 'react';
import { ModeToggle } from '@/components/shared/ToggleTheme';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, Gamepad2, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PrivateChat, User } from '@/interface/type';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { SendGameRequest } from '@/redux/slices/games';
import uid from '@/lib/uuid';
import { RootState } from '@/redux/store';

interface HeaderProps {
    data: PrivateChat | undefined
    profile: User | undefined
}

const Header: FC<HeaderProps> = ({
    data,
    profile
}) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const userData = useMemo(() => {
        return data?.userDetails
    }, [data?.userDetails])

    const handleGameRequest = async () => {
        if (userData && data?._id && profile) {
            const createNewRoom = {
                receiverId: userData._id,
                receiverData: userData,
                senderId: profile._id,
                senderData: profile,
                conversationId: data?._id,
                createdAt: new Date().toISOString(),
                _id: uid()
            }
            await dispatch(SendGameRequest(createNewRoom as any) as any)
            // router.push(`/games/${createNewRoom?._id}?userId=${userData._id}`)
        }
    }

    return (
        <div className={cn("w-full h-16 px-2 border-b")}>
            <div className="flex justify-between items-center h-full w-full">
                {/* logo */}
                {userData ?
                    <div className='flex items-center gap-2'>
                        <div className='md:hidden cursor-pointer'>
                            {/* <SheetSide trigger={<Menu size={30} className='cursor-pointer'/>}>
                                <Sidebar />
                            </SheetSide> */}
                            <ChevronLeft
                                size={30} onClick={() => router.push('/')} />
                        </div>
                        <>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={userData.profilePicture} alt="Avatar" />
                                    <AvatarFallback>{userData.username[0]}</AvatarFallback>
                                </Avatar>
                                <div className='w-40'>
                                    <div className="text-xl font-bold 
                                    text-gray-900 dark:text-gray-100 truncate">
                                        {userData?.username}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                        {data?.typing ? "typing..." : userData?.status ? "online" : "offline"}
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
                    :
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>}
                {/* navigation */}
                <div className="items-center gap-3 flex">
                    {/*  */}
                    {/* mode toggle */}
                    <div className='md:hidden flex gap-2'>
                        <ModeToggle />
                        <Button variant="outline" size="icon" onClick={handleGameRequest}>
                            <Gamepad2 size={30} />
                        </Button>
                    </div>
                </div>
                {/*  */}
                <div className='hidden md:flex gap-2'>
                    <ModeToggle />
                    <Button variant="outline" size="icon"
                        // disabled={alreadyRequested ? true : false}
                        onClick={handleGameRequest}>
                        <Gamepad2 size={30} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
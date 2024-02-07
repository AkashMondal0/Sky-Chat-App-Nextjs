/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
    Card,
    CardContent,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserNav } from "./user-nav"
import SearchModal from "@/components/modal/search_user"
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import GroupCreateModal from '@/components/modal/GroupCreate';

export default function Sidebar() {

    const ArrangeDateByeDate = useMemo(() => [], [])

    return (
        <div>
            <Card className="col-span-3 border-none">
                <ScrollArea className={`h-[100dvh] w-full md:w-96 scroll-smooth`}>
                    <div className="flex justify-between w-full p-6 items-center">
                        <CardTitle>Next Chat</CardTitle>
                        <UserNav user={null} />
                    </div>
                    <CardContent className='p-0'>
                        <div className='flex justify-between items-center w-full mb-2 px-4'>
                            <div className='flex gap-1'>
                                <SearchModal />
                                {/* <GroupCreateModal /> */}
                            </div>
                            <Button variant={"ghost"}><Bell className='w-6 h-6 cursor-pointer' /></Button>
                        </div>
                        <div className='px-2'>
                            {/* {status === "error" && <div>{error?.message}</div>}
                            {status === "pending" && <div>
                                {Array.from({ length: 10 }).map((_, i) => <UserCardLoading key={i} />)}
                            </div>} */}
                            <>
                                {ArrangeDateByeDate?.map((item) => { return <></> })}
                            </>
                        </div>
                    </CardContent>
                </ScrollArea>
            </Card>
        </div>
    )
}

const UserCardLoading = () => {
    return <div className="flex items-center my-4 py-3 w-full h-auto rounded-2xl px-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="ml-4 space-y-1">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
}
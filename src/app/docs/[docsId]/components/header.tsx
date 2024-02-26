/* eslint-disable @next/next/no-img-element */
'use client'
import { cn } from '@/lib/utils';
import { FC, useMemo } from 'react';
import { ModeToggle } from '@/components/shared/ToggleTheme';
import { PrivateChat, User } from '@/interface/type';
import { Button } from '@/components/ui/button';
import { CopyIcon, LogOutIcon, Share2Icon } from 'lucide-react';
import { toolProps } from '../../reducer';
import { Members_Sketch } from '../page';
import { DropDown } from './components';
import MyAvatar from '@/components/shared/MyAvatar';

interface HeaderProps {
    toggleScreen: (screen: "document" | "Both" | "Canvas") => void;
    data: toolProps
    members: Members_Sketch[]
    profileState?: User | null | undefined
}

const Header: FC<HeaderProps> = ({
    toggleScreen,
    data,
    members,
    profileState
}) => {

    const handleGameRequest = async (e: string) => {
        toggleScreen(e as "document" | "Both" | "Canvas");
    }

    return (
        <div className={cn("w-full h-[4rem]")}>
            <div className="flex justify-between items-center h-full w-full">
                {/* logo */}
                <div className='mx-2'><MyAvatar src={"/logo.png"} alt={'logo'} size='50' /></div>
                <div>
                    <Button variant={data.toggle === "document" ? "default" : "outline"} onClick={() => handleGameRequest("document")}>Document</Button>
                    <Button variant={data.toggle === "Both" ? "default" : "outline"} onClick={() => handleGameRequest("Both")}>Both</Button>
                    <Button variant={data.toggle === "Canvas" ? "default" : "outline"} onClick={() => handleGameRequest("Canvas")}>Canvas</Button>
                </div>
                {/* navigation */}
                <div className='flex gap-2'>
                    <DropDown data={members} profileState={profileState} />
                    <DialogShareButton data={""}>
                        <Button>
                            <Share2Icon className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                    </DialogShareButton>
                    {/* <ModeToggle />
                    <Button variant={"link"}>
                        <Share2Icon className="mr-2 h-4 w-4" />
                        Invite
                    </Button>
                    <Button>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        Leave
                    </Button> */}
                </div>
            </div>
        </div>
    );
};


import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogShareButton({
    children,
    data
}: {
    children: React.ReactNode
    data:string
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={data}
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Header;
/* eslint-disable @next/next/no-img-element */
'use client'
import { cn } from '@/lib/utils';
import { FC, useMemo } from 'react';
import { ModeToggle } from '@/components/shared/ToggleTheme';
import { PrivateChat, User } from '@/interface/type';
import { Button } from '@/components/ui/button';
import { LogOutIcon, Share2Icon } from 'lucide-react';
import { toolProps } from '../reducer';
import { Members_Sketch } from '../page';
import { DropDown } from './components';

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
                <>logo</>
                <div>
                    <Button variant={data.toggle === "document" ? "default" : "outline"} onClick={() => handleGameRequest("document")}>Document</Button>
                    <Button variant={data.toggle === "Both" ? "default" : "outline"} onClick={() => handleGameRequest("Both")}>Both</Button>
                    <Button variant={data.toggle === "Canvas" ? "default" : "outline"} onClick={() => handleGameRequest("Canvas")}>Canvas</Button>
                </div>
                {/* navigation */}
                <div className='flex gap-2'>
                    <DropDown data={members} profileState={profileState}/>
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

export default Header;
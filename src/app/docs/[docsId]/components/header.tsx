/* eslint-disable @next/next/no-img-element */
'use client'
import { cn } from '@/lib/utils';
import { FC, useMemo } from 'react';
import { ModeToggle } from '@/components/shared/ToggleTheme';
import { PrivateChat, User } from '@/interface/type';
import { Button } from '@/components/ui/button';
import { LogOutIcon, Share2Icon } from 'lucide-react';

interface HeaderProps {
}

const Header: FC<HeaderProps> = ({

}) => {

    const handleGameRequest = async () => {

    }

    return (
        <div className={cn("w-full h-[4rem]")}>
            <div className="flex justify-between items-center h-full w-full">
                {/* logo */}
                <>logo</>
                <div>
                    <Button variant="outline">Document</Button>
                    <Button variant="outline">Both</Button>
                    <Button variant="outline">Canvas</Button>
                </div>
                {/* navigation */}
                <div className='hidden md:flex gap-2'>
                    <ModeToggle />
                    <Button variant={"link"}>
                        <Share2Icon className="mr-2 h-4 w-4" />
                        Invite
                    </Button>
                    <Button>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        Leave
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
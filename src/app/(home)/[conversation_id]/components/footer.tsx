import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { PrivateChat } from '@/interface/type';
interface ChatFooterProps {
    data: PrivateChat | undefined
}
const ChatFooter: FC<ChatFooterProps> = ({
    data
}) => {


    return (
        <div className={cn('navbar-blur', "w-full py-4 bottom-0 z-50 sticky border-t")}>
            <div className="flex justify-between items-center h-full w-full px-3">
                <div className="flex w-full items-center dark:bg-neutral-700 
                bg-neutral-200 dark:text-neutral-100 text-neutral-800
                rounded-xl">
                    <input
                        className='outline-none focus:none bg-transparent w-full p-2'
                        type="text" placeholder="send a message"
                        // onFocus={isTyping}
                        // onBlur={stopTyping}
                        // value={inputValue}
                        // onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button type="button" variant={"ghost"} className='rounded-xl'>
                        <Send />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatFooter;
import { FC, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { PrivateChat, User } from '@/interface/type';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
interface ChatFooterProps {
    data: PrivateChat | undefined
    profile?: User | undefined
}
const schema = z.object({
    message: z.string().min(1)
})
const ChatFooter: FC<ChatFooterProps> = ({
    data
}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            message: "",
        }
    });

    const sendMessageHandle = useCallback((_data: { message: string }) => {
        reset()
    }, [])


    return (
        <div className={cn("w-full border-t items-center p-2 h-20 my-auto max-h-20")}>
            <form onSubmit={handleSubmit(sendMessageHandle)} className="flex w-full items-center dark:bg-neutral-700 mt-2
                bg-neutral-200 dark:text-neutral-100 text-neutral-800 rounded-xl">
                <input
                    id='message-input'
                    className='outline-none focus:none bg-transparent w-full p-2'
                    type="text" placeholder="send a message"
                    {...register("message", { required: true })}
                // onFocus={isTyping}
                // onBlur={stopTyping}
                // value={inputValue}
                />
                <Button type="submit"
                    onClick={handleSubmit(sendMessageHandle)}
                    variant={"ghost"} className='rounded-xl'>
                    <Send />
                </Button>
            </form>
        </div>
    );
};

export default ChatFooter;
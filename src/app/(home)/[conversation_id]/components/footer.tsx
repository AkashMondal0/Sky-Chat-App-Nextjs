/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Paperclip, Send } from 'lucide-react';
import { Assets, PrivateChat, User, typingState } from '@/interface/type';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { socket } from '@/lib/socket';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { createPrivateChatConversation, sendMessagePrivate } from '@/redux/slices/conversation';
import { createConnectionApi } from '@/redux/slices/profile';
import { useRouter } from 'next/navigation';
import { ProfileContext } from '@/components/provider/Profile_provider';
import LoadingComponent from './LoadingComponent';
import uid from '@/lib/uuid';
interface ChatFooterProps {
    conversation: PrivateChat | undefined
    profile?: User | undefined
    newConversation?: boolean
}
const schema = z.object({
    message: z.string().min(1)
})
const ChatFooter: FC<ChatFooterProps> = ({
    conversation,
    profile,
    newConversation
}) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const profileState = useContext(ProfileContext)
    const [stopTyping, setStopTyping] = useState(true)
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            message: "",
        }
    });
    const [assets, setAssets] = useState<Assets[]>([])

    const onFocus = useCallback(() => {
        if (conversation && profile && !newConversation) {
            const message: typingState = {
                conversationId: conversation?._id,
                senderId: profile?._id,
                receiverId: conversation?.userDetails?._id,
                typing: true
            } as typingState
            socket.emit('message_typing_sender', message)
        }
    }, [])

    const onBlurType = useCallback(() => {
        if (conversation && profile && !newConversation) {
            const message: typingState = {
                conversationId: conversation?._id,
                senderId: profile?._id,
                receiverId: conversation?.userDetails?._id,
                typing: false
            } as typingState
            socket.emit('message_typing_sender', message)
        }
        setStopTyping(true)
    }, [])

    const debouncedHandleOnblur = useCallback(debounce(onBlurType, 2000), []);


    const sendMessageHandle = useCallback(async (data: { message: string }) => {

        if (newConversation && profile && conversation?.userDetails?._id) {
            const res = await dispatch(createConnectionApi({
                profileId: profile._id,
                userId: conversation?.userDetails?._id
            }) as any)
            if (res?.payload?._id) {
                await dispatch(createPrivateChatConversation({
                    users: [profile, conversation?.userDetails],
                    content: data.message,
                    conversation: { ...res?.payload, userDetails: profile },
                    assets: []
                }) as any)
                // profileState.StartApp()
                router.replace(`/${res?.payload._id}`)
            }
            reset()
        } else {
            if (!conversation || !profile) return
            const _data = {
                conversationId: conversation?._id as string,
                content: data.message,
                member: profile,
                receiver: conversation?.userDetails as User,
                assets: assets
            }
            reset()
            dispatch(sendMessagePrivate(_data) as any)
        }
    }, [])


    const handleFileUpload = useCallback(() => {
        document?.getElementById('files')?.click()
    }, [])

    const onChangeFile = useCallback((e: any) => {
        const files = e.target.files
        if (files.length > 0) {
            const _assets = Array.from(files).map((file: any) => {
                return {
                    _id: uid(),
                    url: URL.createObjectURL(file),
                    file: file
                }
            })
            setAssets(_assets)
        }
    }, [])


    if (!profile) return <LoadingComponent />

    if (!conversation) return <LoadingComponent />

    return (
        <>
            <UploadFileComponent assets={assets} />
            <div className={cn("w-full border-t items-center p-2 h-16 my-auto max-h-20 flex gap-2")}>

                <Button type="submit"
                    onClick={handleFileUpload}
                    variant={"outline"} className='rounded-3xl'>
                    <Paperclip />
                </Button>
                <input
                    type="file"
                    accept="image/*, video/*, audio/*"
                    multiple
                    name="file"
                    id="files"
                    className='hidden'
                    onChange={(e) => { onChangeFile(e) }}
                />
                <form onSubmit={handleSubmit(sendMessageHandle)} className="flex w-full items-center dark:bg-neutral-900
                bg-neutral-200 dark:text-neutral-100 text-neutral-800 rounded-3xl">
                    <input
                        id='message-input'
                        className='outline-none focus:none bg-transparent w-full p-2
                    dark:placeholder-neutral-100 placeholder-neutral-800'
                        type="text" placeholder="send a message"

                        {...register("message", {
                            required: true,
                            onChange(e) {
                                if (stopTyping) {
                                    onFocus()
                                    setStopTyping(false)
                                }
                                else {
                                    debouncedHandleOnblur()
                                }
                                if (e.target.value === "") {
                                    debouncedHandleOnblur()
                                }
                            },
                        })}
                    />
                </form>
                <Button type="submit"
                    onClick={handleSubmit(sendMessageHandle)}
                    variant={"outline"} className='rounded-3xl'>
                    <Send />
                </Button>
            </div>
        </>
    );
};

export default ChatFooter;

const UploadFileComponent = ({
    assets
}: {
    assets: Assets[]
}) => {
    return <>
        {
            assets.map((asset, index) => {
                return (
                    <div key={index} className="flex gap-2 ">
                        <img src={asset.url} alt="" className="w-10 h-10" />
                    </div>
                )
            })
        }
    </>
}
import { FC } from 'react';
import { CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrivateMessage } from '@/interface/type';
interface MessagesCardProps {
    data: PrivateMessage
    profile: boolean
    isReply?: boolean
    seen: boolean
}
const MessagesCard: FC<MessagesCardProps> = ({
    data,
    profile,
    seen
}) => {

   
    return (
        <div className={`my-3 flex items-center ${profile ? "justify-end" : " justify-start"}`}>
            <div className={`px-4 py-1 rounded-2xl border 
             ${profile ? "bg-primary/90 text-primary-foreground ml-8" : "bg-accent mr-8"}`}>
                <div className=''>
                    <p className='break-all'>{data.content}</p>
                    <div className='flex gap-1 justify-end'>
                        <div className={`text-sm text-gray-500 ${profile ? "prl-8" : "pr-8"}`}>
                            {new Date(data.createdAt as Date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                        </div>
                        {profile ? <div className='text-sm text-gray-500'>
                            <CheckCheck size={20} className={seen ? 'text-sky-400' : ""} />
                        </div> : null}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MessagesCard;
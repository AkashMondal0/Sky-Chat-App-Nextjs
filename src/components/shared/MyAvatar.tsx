import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
const MyAvatar = ({
    src,
    size = "30px",
    alt  = "",
}: {
    src: string
    size?: string 
    alt: string
}) => {
    return (
        <Avatar>
            <AvatarImage 
            src={src}
            sizes={size} 
            alt={alt}
            />
            <AvatarFallback>
                {alt[0]||""}
            </AvatarFallback>
        </Avatar>
    )
}

export default MyAvatar
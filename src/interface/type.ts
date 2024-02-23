
export interface File {
    url: string;
    type: 'image' | 'video' | 'audio' | 'file';
    caption?: string
}

export interface PrivateMessage {
    _id?: string;
    memberDetails?: User;
    content: string;
    fileUrl?: File[] | null;
    memberId: string;
    senderId: string;
    receiverId: string;
    conversationId: string;
    deleted: boolean;
    seenBy: [User['_id']];
    deliveredTo?: [User['_id']];
    createdAt: string | Date | any;
    updatedAt: string | Date | any;
    replyTo?: {
        _id: string;
        content: string;
        memberId: string;
        conversationId: string;
        deleted: boolean;
        replyContent: PrivateMessage;
    };
    typeDate?: Boolean;
}

export interface PrivateChat {
    _id?: string;
    users?: string[];
    userDetails?: User;
    lastMessageContent: string;
    messages?: PrivateMessage[];
    updatedAt?: string | Date;
    createdAt?: string | Date;
    typing?: boolean;
    loadAllMessages?: boolean | undefined;
    page?: number | undefined;
}

export interface PrivateMessageSeen {
    messageIds: string[];
    memberId: string;
    receiverId: string;
    conversationId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface typingState {
    conversationId: string;
    senderId: string;
    receiverId: string;
    typing: boolean;

}

export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
    coverPicture?: string;
    followers?: string[];
    followings?: string[];
    privateIds?: string[];
    groupIds?: string[];
    bio?: string;
    city?: string;
    from?: string;
    updatedAt?: string;
    createdAt?: string;
    themes?: CurrentTheme[]
    status?: Status[];
    isOnline?: boolean;
}

export interface Status {
    _id: string,
    url: string,
    type: 'image' | 'video' | 'audio' | "text"
    forText?: string;
    forTextBackground?: boolean;
    forTextColor?: string;
    forTextSize?: string;
    caption?: string;
    createdAt: string | Date;
    seen?: string[];
}

export interface Assets {
    _id: string,
    url: string,
    type: 'image' | 'video' | 'audio' | "text"
    caption: string;
}


export interface CurrentTheme {
    id: number,
    name: string,
    primary: string,
    primaryBackground: string,
    background: string,
    textColor: string,
    subTextColor: string,
    primaryTextColor: string,
    selectedTextColor: string,
    iconColor: string,
    primaryIconColor: string,
    iconActiveColor: string,
    badge: string,
    inputColor: string,
    inputBackground: string,
    selectedItemColor: string,
    borderColor: string,
    LinkButtonColor: string,
    secondaryLinkButtonColor: string,
    ButtonColor: string,
    DangerButtonColor: string,
    SuccessButtonColor: string,
    WarningButtonColor: string,
    cardBackground: string,
    color: string
    actionButtonColor: string
    seen: string
}


export interface GameRequest {
    receiverId: string;
    senderId: string;
    conversationId: string;
    gameType?: "tic-tac-toe";
    createdAt: string | Date;
    _id: string;
    receiverData?:User
    senderData?:User
    turn: "X" | "O"
    
}
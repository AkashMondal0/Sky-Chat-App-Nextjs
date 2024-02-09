/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import MessagesCard from './message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PrivateChat, PrivateMessage, User } from '@/interface/type';
import { AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, List, ScrollSync } from 'react-virtualized';


interface ChatBodyProps {
    data: PrivateChat | undefined
    profile: User | undefined | null
}

const ChatBody: FC<ChatBodyProps> = ({
    data,
    profile
}) => {
    const [dimension, setDimension] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const handleResize = () => {
            setDimension({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    const isRowLoaded = ({ index }: {
        index: number
    }) => {
        console.log(index)
    };

    const loadMoreRows = ({ startIndex, stopIndex }: {
        startIndex: number
        stopIndex: number
    }) => {
        console.log(startIndex, stopIndex)
    };

    const cache = new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 0,
        defaultWidth: 50,
    })

    const list = useMemo(() => {
        return data?.messages || []
    }, [data?.messages])

    if (!profile) {
        return <div>user not found</div>
    }

    return (
        <div className='flex-grow'>
            <AutoSizer>
                {({ width }) => (
                    <List
                        id='style-1'
                        className='p-2'
                        width={width}
                        height={dimension.height - 150}
                        rowCount={list.length}
                        rowHeight={cache.rowHeight}
                        rowRenderer={({ key, index, style, parent }) => (
                            <CellMeasurer
                                key={key}
                                cache={cache}
                                parent={parent}
                                columnIndex={0}
                                rowIndex={index}
                            >
                                {({ measure, registerChild }) => {
                                    const element = list[index]
                                    const seen = element.memberId === profile?._id
                                    return <div
                                        style={{
                                            ...style,
                                        }}>
                                        <MessagesCard
                                            seen={seen}
                                            data={element}
                                            profile={profile}
                                        />
                                    </div>
                                }}
                            </CellMeasurer>
                        )}
                    />
                )}
            </AutoSizer>
        </div>
    );

};

export default ChatBody;





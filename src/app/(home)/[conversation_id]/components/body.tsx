/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { FC, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import MessagesCard from './message';
import { PrivateChat, PrivateMessage, User } from '@/interface/type';
import { AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, List, ScrollSync } from 'react-virtualized';
import { dateFormat } from '@/lib/timeFormat';


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
        const dateSorted = [...data?.messages]
            .slice(0, 0 + 10)
            .filter((value, index, dateArr) => index === dateArr
                .findIndex((time) => (dateFormat(time.createdAt) === dateFormat(value.createdAt))))
        // .map((item) => {
        //     item._id = new Date(item.createdAt).getTime().toString();
        //     item = { ...item, typeDate: true }
        //     return item
        // })
        const messageSorted = [...data?.messages, ...dateSorted]
            .sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            .reverse()
        return messageSorted
    }, [data?.messages])

    if (!profile) {
        return <div>user not found</div>
    }

    const [scrollToIndex, setScrollToIndex] = useState(list.length - 1)

    const scrollToBottom = () => {
        setScrollToIndex(list.length - 1)
    }

    useEffect(() => {
        scrollToBottom()
    }, [list])

    return (
        <Suspense>
            <AutoSizer className='flex-grow'>
                {({ width }) => (
                    <List
                        scrollToIndex={scrollToIndex}
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
                                    const element = list[index] as PrivateMessage
                                    const seen = element.seenBy.includes(profile._id) && element.seenBy.length >= 2
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
        </Suspense>
    );

};

export default ChatBody;





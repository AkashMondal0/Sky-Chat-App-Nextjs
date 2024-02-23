/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import MyAvatar from '@/components/shared/MyAvatar';
import { Card } from '@/components/ui/card';
import { User } from '@/interface/type';
import { socket } from '@/lib/socket';
import { RootState } from '@/redux/store';
import { Circle, X } from 'lucide-react';
import { redirect, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export interface InGameData {
    roomId: string
    state: any
    senderId: string
    receiverId: string
    currentTurn: "X" | "O"
    type: "START_GAME" | "END_GAME" | "DRAW" | "IN_GAME" | "EXIT_GAME"
    firstTurn: "X" | "O"
    turnCount: number,
    win?: "X" | "O"
}

interface WinHistory {
    user?: User,
    winCount: number
    loseCount: number
    totalGames: number
}

const TicTacToe = ({
    params: { roomId }
}: {
    params: {
        roomId: string
    }
}) => {
    const router = useRouter()
    const userId = useSearchParams().get("userId")
    const MyTurnIs = useSearchParams().get("turn")
    const profile = useSelector((state: RootState) => state.Profile_Slice.user)
    const friendList = useSelector((state: RootState) => state.Conversation_Slice.friendListWithDetails)
    const [state, setState] = React.useState(Array(9).fill(null))
    const [currentTurn, setCurrentTurn] = React.useState<"X" | "O">("X")
    const [turnCount, setTurnCount] = React.useState(0)
    const [dialogOpen, setDialogOpen] = React.useState({
        open: false,
        type: "",
        message: "",
        subMessage: ""
    })
    const [winHistory, setWinHistory] = React.useState<WinHistory>({
        user: profile as User,
        winCount: 0,
        loseCount: 0,
        totalGames: 0
    })

    const remotePlayer = useMemo(() => {
        return friendList.find((user: User) => user._id === userId)
    }, [friendList, userId])

    const handleClick = useCallback((i: number) => {
        if (MyTurnIs !== currentTurn) {
            return toast.error("Wait for your turn", {
                duration: 2000,
            })
        } else {
            if (state[i] === null) {
                const newState = Array.from(state)
                newState[i] = currentTurn
                setState(newState)
                socket.emit('in_game_sender', {
                    roomId,
                    state: newState,
                    senderId: profile?._id,
                    receiverId: remotePlayer?._id,
                    currentTurn: currentTurn === "X" ? "O" : "X",
                    turnCount: turnCount + 1,
                    type: "IN_GAME"
                })
                setTurnCount(turnCount + 1)
                setCurrentTurn(currentTurn === "X" ? "O" : "X")
                checkWin(newState)
            }
        }
    }, [currentTurn, state])

    const winnerName = useCallback((data?: "X" | "O") => {
        if (data === MyTurnIs) {
            return "you"
        } else {
            return remotePlayer?.username
        }
    }, [])



    const checkWin = useCallback((state: any) => {
        const win = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [1, 4, 8],
            [2, 4, 6],
            [0, 4, 8]
        ]

        for (let i = 0; i < win.length; i++) {
            const [a, b, c] = win[i]
            if (state[a] && state[a] === state[b] && state[a] === state[c]) {
                // toast.success(`${winnerName(state[a])} won! `, {
                //     duration: 5000
                // })
                setState(Array(9).fill(null))
                const Random = Math.random() > 0.5 ? "X" : "O"
                setCurrentTurn(Random)
                setTurnCount(0)
                setDialogOpen({
                    open: true,
                    type: "END_GAME",
                    message: `${winnerName(state[a])} won! `,
                    subMessage: "Do you want to play again?"
                })
                socket.emit('in_game_sender', {
                    roomId,
                    state: Array(9).fill(null),
                    senderId: profile?._id,
                    receiverId: remotePlayer?._id,
                    currentTurn: Random,
                    turnCount: 0,
                    win: state[a],
                    type: "END_GAME"
                })
            }
        }
    }, [])


    const currentTurnName = useMemo(() => {
        if (currentTurn === MyTurnIs) {
            return "Your"
        } else {
            return remotePlayer?.username
        }
    }, [currentTurn])

    const checkDraw = useCallback(() => {
        if (turnCount === 9) {
            setDialogOpen({
                open: true,
                type: "END_GAME",
                message: `Game Draw! `,
                subMessage: "Do you want to play again?"
            })
            socket.emit('in_game_sender', {
                roomId,
                state: Array(9).fill(null),
                senderId: profile?._id,
                receiverId: remotePlayer?._id,
                currentTurn: "X",
                turnCount: 0,
                type: "DRAW"
            })

        }
    }, [])

    const setData = (data: InGameData) => {
        setState(data.state)
        setCurrentTurn(data.currentTurn)
        setTurnCount(data.turnCount)
    }


    useEffect(() => {
        socket.on('in_game_receiver', (data: InGameData) => {
            switch (data.type) {
                case "IN_GAME":
                    setData(data)
                    break;
                case "END_GAME":
                    // toast.success(`${winnerName(data.win)} won!`, {
                    //     duration: 5000
                    // })
                    setDialogOpen({
                        open: true,
                        type: "END_GAME",
                        message: `${winnerName(data.win)} won! `,
                        subMessage: "Do you want to play again?"
                    })
                    setData(data)
                    break;
                case "DRAW":
                    setDialogOpen({
                        open: true,
                        type: "END_GAME",
                        message: `Game Draw! `,
                        subMessage: "Do you want to play again?"
                    })
                    setData(data)
                    break;
                case "EXIT_GAME":
                    router.back()
                    break;
                case "START_GAME":
                    setData(data)
                    break;
                default:
                    break;
            }
        })

        return () => {
            socket.off('in_game_receiver')
        }
    }, [])


    const reSetDialog = useCallback(() => {
        setDialogOpen({
            ...dialogOpen,
            open: false,
            type: "",
            message: "",
            subMessage: ""
        })
        router.back()
        socket.emit('in_game_sender', {
            roomId,
            state: Array(9).fill(null),
            senderId: profile?._id,
            receiverId: remotePlayer?._id,
            currentTurn: "X",
            turnCount: 0,
            type: "EXIT_GAME"
        })
    }, [dialogOpen])

    const playAgain = useCallback(() => {
        setDialogOpen({
            ...dialogOpen,
            open: false,
            type: "",
            message: "",
            subMessage: ""
        })
        socket.emit('in_game_sender', {
            roomId,
            state: Array(9).fill(null),
            senderId: profile?._id,
            receiverId: remotePlayer?._id,
            currentTurn: "X",
            turnCount: 0,
            type: "START_GAME"
        })
    }, [])

    const resetGame = useCallback(() => {
        setState(Array(9).fill(null))
        setCurrentTurn("X")
        setTurnCount(0)
        setDialogOpen({
            open: false,
            type: "",
            message: "",
            subMessage: ""
        })
        socket.emit('in_game_sender', {
            roomId,
            state: Array(9).fill(null),
            senderId: profile?._id,
            receiverId: remotePlayer?._id,
            currentTurn: "X",
            turnCount: 0,
            type: "START_GAME"
        })
    }, [])

    return (
        <div id="board" className='flex justify-center items-center h-screen px-2'>
            <div>
                <div>
                    <Card>
                        <h1 className="text-2xl text-center font-bold">Tic Tac Toe</h1>
                        <div className="flex justify-center items-center">
                            <h1 className="text-2xl text-center font-bold">Current Turn: {currentTurnName}</h1>
                        </div>
                        <div className='flex items-center justify-between px-5'>
                            <div className='text-center'>
                                <MyAvatar src={profile?.profilePicture || ""} alt={profile?.username as string} />
                                <p>
                                    {profile?.username} - {winHistory.winCount}
                                </p>
                                <p>{MyTurnIs}</p>
                            </div>
                            <Button onClick={resetGame}>Reset Game</Button>
                            {remotePlayer && <div className='text-center'>
                                <MyAvatar src={remotePlayer?.profilePicture || ""} alt={remotePlayer?.username as string} />
                                <p>
                                    {remotePlayer?.username} - {winHistory.loseCount}
                                </p>
                                <p>{MyTurnIs !== "X" ? "X" : "O"}</p>
                            </div>}
                        </div>
                    </Card>
                </div>

                <div>
                    <div className="board-row flex">
                        <BoardRow value={state[0]} onClick={() => handleClick(0)} />
                        <BoardRow value={state[1]} onClick={() => handleClick(1)} />
                        <BoardRow value={state[2]} onClick={() => handleClick(2)} />
                    </div>
                    <div className="board-row flex">
                        <BoardRow value={state[3]} onClick={() => handleClick(3)} />
                        <BoardRow value={state[4]} onClick={() => handleClick(4)} />
                        <BoardRow value={state[5]} onClick={() => handleClick(5)} />
                    </div>
                    <div className="board-row flex">
                        <BoardRow value={state[6]} onClick={() => handleClick(6)} />
                        <BoardRow value={state[7]} onClick={() => handleClick(7)} />
                        <BoardRow value={state[8]} onClick={() => handleClick(8)} />
                    </div>
                </div>
            </div>
            <AlertDialog open={dialogOpen.open}>
                <AlertDialogContent >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dialogOpen.message}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dialogOpen.subMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={reSetDialog}>Exit</AlertDialogCancel>
                        <AlertDialogAction onClick={playAgain}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}

export default TicTacToe

const BoardRow = ({
    value,
    onClick
}: {
    value: "X" | "O" | null
    onClick: () => void
}) => {
    return <div className="border-[2px] w-32 h-32 rounded-lg m-1" onClick={onClick}>
        <div className="w-full h-full flex justify-center items-center">
            {value === null ? null : value === "X" ? <X size={50} /> : <Circle size={50} />}
        </div>
    </div>
}


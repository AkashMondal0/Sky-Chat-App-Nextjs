"use client"
import { socket } from '@/lib/socket';
import { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext<any>({})
export { SocketContext };
const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [callAccepted, setCallAccepted] = useState(false) as any
    const [callEnded, setCallEnded] = useState(false) as any
    const [stream, setStream] = useState() as any
    const [name, setName] = useState('') as any
    const [call, setCall] = useState({}) as any
    const [me, setMe] = useState('') as any
    const myVideo = useRef() as any
    const userVideo = useRef() as any
    const connectionRef = useRef() as any

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            });

        // socket.on('me', (id) => setMe(id));
        // socket.on('callUser', ({ from, name: callerName, signal }) => {
        //     setCall({ isReceivingCall: true, from, name: callerName, signal });
        // });
    }, []);

    const answerCall = () => {
        // setCallAccepted(true);
        // const peer = new Peer({ initiator: false, trickle: false, stream });
        // peer.on('signal', (data) => {
        //     socket.emit('answerCall', { signal: data, to: call.from });
        // });
        // peer.on('stream', (currentStream) => {
        //     userVideo.current.srcObject = currentStream;
        // });
        // peer.signal(call.signal);
        // connectionRef.current = peer;
    };

    const callUser = (id: any) => {
        // const peer = new Peer({ initiator: true, trickle: false, stream });
        // peer.on('signal', (data) => {
        //     socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
        // });
        // peer.on('stream', (currentStream) => {
        //     userVideo.current.srcObject = currentStream;
        // });
        // socket.on('callAccepted', (signal) => {
        //     setCallAccepted(true);
        //     peer.signal(signal);
        // });
        // connectionRef.current = peer;
    };

    const leaveCall = () => {
        // setCallEnded(true);
        // connectionRef.current.destroy();
        // window.location.reload();
    };

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
        }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;

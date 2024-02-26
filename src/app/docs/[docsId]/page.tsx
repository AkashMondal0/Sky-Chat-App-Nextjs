/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import React, { useEffect, useReducer, useState } from "react"
import { socket } from "@/lib/socket"
import { toast } from "sonner"

import Header from './components/header';
import { Button } from '@/components/ui/button';
import { PencilRuler } from 'lucide-react';
import ToolDialog from './components/tool-dialog';
import { initialToolState, reducer } from './reducer';
import SideButtons from './components/tool-button';
import ResizableWindow from './components/resize-window';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserType } from '@/interface/type';
import { AvatarToast } from '@/components/shared/MyAlert';

export interface Members_Sketch {
  user?: UserType
  canvasData?: any
}

export default function PlaygroundPage() {
  const friendList = useSelector((state: RootState) => state.Conversation_Slice.friendListWithDetails);
  const profileState = useSelector((state: RootState) => state.Profile_Slice.user);

  const canvas = React.useRef<ReactSketchCanvasRef>(null);
  const [tool, setTool] = useReducer(reducer, initialToolState)
  const [members, setMembers] = useState<Members_Sketch[]>([]);
  const [me, setMe] = React.useState<any>(false);
  const [canvasData, setCanvasData] = React.useState<any>(null);

  function findUserDetails(userId: string,socketId: string) {
    const userData = friendList.find((user) => user._id === userId);
    setMembers([...members, {
      user: userData,
    }]);
    toast.custom((t) => <AvatarToast data={userData} />, {
      duration: 3000
    })
    // send all data user new join user
    const roomAllData = {
      members: members,
      canvasData: canvasData,
      receiverId: socketId
    } 
    socket.emit('sketch_all_room_data_sender', roomAllData);
  }

  useEffect(() => {
    function handleResize() {
      setTool({
        type: "CANVAS_SIZE",
        payload: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      })
    }
    setMembers([...members, {
      user: profileState as UserType
    }])

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sendCanvasData = (canvas: any) => {
    socket.emit('canvasDataSend', canvasData);
  }

  useEffect(() => {
    socket.on('sketch_in_room_sender', (data) => {
      console.log(data, 'data')
      canvas.current?.loadPaths(data);
    })

    socket.on('sketch_create_room_receiver', (data) => {
      findUserDetails(data.userId, data.socketId);
    })

    socket.on('following_pointer_receiver', (data) => {
      console.log(data, 'data')
    })

    socket.on('sketch_all_room_data_receiver', (data) => {
      // {
      //   members: members,
      //   canvasData: canvasData,
      //   receiverId: socketId
      // }
      // setMembers(data.members);
      // console.log(data.members)
      // canvas.current?.loadPaths(data.canvasData);
    })

    return () => {
      socket.off('canvasDataReceive');
      socket.off('sketch_create_room_receiver');
    }
  }, [])

  const toggleScreen = (screen: "document" | "Both" | "Canvas") => {
    setTool({ type: "TOGGLE", payload: screen })
  }
// console.log(members, 'members')
  return (
    <div>
      <Header
        profileState={profileState}
        toggleScreen={toggleScreen}
        data={tool} members={members} />
      <ResizableWindow
        toggle={tool.toggle}
        children2={<div className='w-full h-screen'></div>}>
        <div className="relative justify-center w-full h-full gap-4">
          {/* // action button div */}
          <div className='absolute top-2 left-2'>
            <ToolDialog data={tool} dispatch={setTool}>
              <Button variant="secondary" className=' rounded-md'>
                <PencilRuler />
              </Button>
            </ToolDialog>
            <SideButtons
              onPencil={() => canvas.current?.eraseMode(false)}
              onUndo={() => canvas.current?.undo()}
              onRedo={() => canvas.current?.redo()}
              onClear={() => canvas.current?.clearCanvas()}
              onEase={() => canvas.current?.eraseMode(true)}
            />
          </div>
          <ReactSketchCanvas
            width={`${tool.width}px`}
            height={`${tool.height - 5}px`}
            ref={canvas}
            onChange={(canvas) => {
              setMe(true)
              setCanvasData(canvas);
            }}
            className='w-full h-full'
            allowOnlyPointerType="all"
            strokeWidth={tool.StrokeWidth}
            canvasColor={tool.canvasBackground}
            strokeColor={tool.PenColor} />
        </div>
      </ResizableWindow>
    </div>
  )
}







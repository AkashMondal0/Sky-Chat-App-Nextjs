'use client'

import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import React, { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import { toast } from "sonner"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Header from './components/header';
import { Button } from '@/components/ui/button';
import { PaintBucketIcon, Paintbrush2, PencilRuler } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function PlaygroundPage() {
  const [color, setColor] = React.useState("black") as any
  const [strokeWidth, setStrokeWidth] = React.useState(4) as any
  const canvas = React.useRef<ReactSketchCanvasRef>(null);
  const [me, setMe] = React.useState<any>(false);
  const [canvasData, setCanvasData] = React.useState<any>(null);

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

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
      toast.success(`Join a room ${data.userId}`);
    })

    return () => {
      socket.off('canvasDataReceive');
      socket.off('sketch_create_room_receiver');
    }
  }, [])


  // <Button onClick={() => canvas.current?.undo()} className="w-24 h-10">Undo</Button>
  // <Button onClick={() => canvas.current?.redo()} className="w-24 h-10">Redo</Button>
  // <Button onClick={() => canvas.current?.clearCanvas()} className="w-24 h-10">Clear</Button>
  // <Button onClick={() => sendCanvasData(canvas.current)} className="w-24 h-10">Send</Button>

  return (
    <div>
      <Header />
      <ResizableDemo
        toggle="Both"
        children2={sideBar()}>
        <div className="relative justify-center w-full h-full gap-4">
          {/* // action button div */}
          <div className='absolute top-5 left-5'>
            <MyTooltip text="Change Theme">
              <Button variant="secondary" className=' rounded-md'>
              <PencilRuler />
              </Button>
            </MyTooltip>
            {/* <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <input type="range" min="1" max="20" value={strokeWidth} onChange={(e) => setStrokeWidth(e.target.value)} /> */}
          </div>
          <ReactSketchCanvas
            width={`${windowSize.width}px`}
            height={`${windowSize.height - 5}px`}
            ref={canvas}
            onChange={(canvas) => {
              setMe(true)
              setCanvasData(canvas);
            }}
            allowOnlyPointerType="all"
            strokeWidth={strokeWidth}
            canvasColor="white"
            strokeColor={color} />

        </div>
      </ResizableDemo>
    </div>
  )
}


function sideBar() {
  return <div className="flex flex-col items-center justify-center w-full h-full gap-4">
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      {/* <Button onClick={() => canvas.current?.undo()} className="w-24 h-10">Undo</Button>
    <Button onClick={() => canvas.current?.redo()} className="w-24 h-10">Redo</Button>
    <Button onClick={() => canvas.current?.clearCanvas()} className="w-24 h-10">Clear</Button>
    <Button onClick={() => sendCanvasData(canvas.current)} className="w-24 h-10">Send</Button> */}
    </div>
  </div>
}


function ResizableDemo({
  children,
  children2
}: {
  children: React.ReactNode
  children2: React.ReactNode
  toggle: "document" | "Both" | "Canvas"
}) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border w-full"
    >
      <ResizablePanel
        collapsible={true}
        minSize={15}
        maxSize={90}
        defaultSize={20}>
        {children2}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanel defaultSize={25}>
        </ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          {children}
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

function MyTooltip({
  children,
  text
}: {
  children: React.ReactNode
  text: string
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
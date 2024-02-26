/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { ReactSketchCanvas } from 'react-sketch-canvas';
import React, {  useContext,  } from "react"
import Header from './components/header';
import { Button } from '@/components/ui/button';
import { PencilRuler } from 'lucide-react';
import ToolDialog from './components/tool-dialog';
import SideButtons from './components/tool-button';
import ResizableWindow from './components/resize-window';
import { UserType } from '@/interface/type';
import { SketchContext } from '../context';

interface Point {
  x: number;
  y: number;
}
interface CanvasPath {
  paths: Point[];
  strokeWidth: number;
  strokeColor: string;
  drawMode: boolean;
  startTimestamp?: number;
  endTimestamp?: number;
}
export interface Members_Sketch {
  user?: UserType
  canvasData?: CanvasPath[]
}

export default function PlaygroundPage() {
  const {
    canvas,
    tool,
    members,
    toggleScreen,
    profileState,
    setTool,
    sendMyCanvas,
    roomData
  } = useContext(SketchContext);

  return (
    <div>
      <Header
        profileState={profileState}
        toggleScreen={toggleScreen}
        data={tool} members={members} roomData={roomData}/>
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
              onUndo={() => {canvas.current?.undo()}}
              onRedo={() => canvas.current?.redo()}
              onClear={() => canvas.current?.clearCanvas()}
              onEase={() => canvas.current?.eraseMode(true)}
            />
          </div>
          <ReactSketchCanvas
            width={`${tool.width}px`}
            height={`${tool.height - 5}px`}
            ref={canvas}
            onStroke={(canvasData: CanvasPath | any) => {
              sendMyCanvas?.(canvasData)
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







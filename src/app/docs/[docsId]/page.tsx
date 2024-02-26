/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import React, { useContext, useEffect, useReducer, useState } from "react"
import { socket } from "@/lib/socket"
import { toast } from "sonner"

import Header from './components/header';
import { Button } from '@/components/ui/button';
import { PencilRuler } from 'lucide-react';
import ToolDialog from './components/tool-dialog';
import { initialToolState, reducer } from '../reducer';
import SideButtons from './components/tool-button';
import ResizableWindow from './components/resize-window';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserType } from '@/interface/type';
import { AvatarToast } from '@/components/shared/MyAlert';
import { SketchContext } from '../context';

export interface Members_Sketch {
  user?: UserType
  canvasData?: any
}

export default function PlaygroundPage() {
  const {
    canvas,
    tool,
    members,
    toggleScreen,
    profileState,
    setTool
  } = useContext(SketchContext);

  // console.log(members)

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
              // setMe(true)
              // setCanvasData(canvas);
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







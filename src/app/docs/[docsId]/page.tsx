'use client'
import { Metadata } from "next"
import Image from "next/image"
import { CodeViewer } from "./components/code-viewer"
import { MaxLengthSelector } from "./components/maxlength-selector"
import { ModelSelector } from "./components/model-selector"
import { PresetActions } from "./components/preset-actions"
import { PresetSave } from "./components/preset-save"
import { PresetSelector } from "./components/preset-selector"
import { PresetShare } from "./components/preset-share"
import { TemperatureSelector } from "./components/temperature-selector"
import { TopPSelector } from "./components/top-p-selector"
import { models, types } from "./data/models"
import { presets } from "./data/presets"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import React, { useEffect } from "react"
import { socket } from "@/lib/socket"


export default function PlaygroundPage() {
  const [color, setColor] = React.useState("#000000") as any
  const [strokeWidth, setStrokeWidth] = React.useState(4) as any
  const canvas = React.useRef<ReactSketchCanvasRef>(null);
  const [me , setMe] = React.useState<any>(false);
  const [canvasData, setCanvasData] = React.useState<any>(null);


  const sendCanvasData = (canvas) => {
    socket.emit('canvasDataSend', canvasData);
  }

  useEffect(() => {
    socket.on('canvasDataReceive', (data) => {
      console.log(data, 'data')
      canvas.current?.loadPaths(data);
      if (me){
      }
    })
  }, [])



  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSelector presets={presets} />
            <PresetSave />
            <div className="hidden space-x-2 md:flex">
              <CodeViewer />
              <PresetShare />
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="complete" className="flex-1">
          <div className="container h-full py-6">
            <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                <div className="grid gap-2">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Mode
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[320px] text-sm" side="left">
                      Choose the interface that best suits your task. You can
                      provide: a simple prompt to complete, starting and ending
                      text to insert a completion within, or some text with
                      instructions to edit it.
                    </HoverCardContent>
                  </HoverCard>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="complete">
                      <span className="sr-only">Complete</span>

                    </TabsTrigger>
                    <TabsTrigger value="insert">
                      <span className="sr-only">Insert</span>

                    </TabsTrigger>
                    <TabsTrigger value="edit">
                      <span className="sr-only">Edit</span>

                    </TabsTrigger>
                  </TabsList>
                </div>
                <input type="range"
                  min="1"
                  defaultValue={1}
                  max="10"
                  step={1}
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(e.target.value)}
                  aria-label="Stroke width"
                />
                <button
                  onClick={() => {
                    canvas.current.redo();
                  }}
                >
                  Redo
                </button>
                <button
                  onClick={() => {
                    canvas.current.undo();
                  }}
                >
                  Undo
                </button>
                <button
                  onClick={() => {
                    console.log(canvas.current);
                    sendCanvasData(canvasData);
                  }}
                >
                  load
                </button>
                {/* <button
                  onClick={() => {
                   canvas.current
                      .exportImage("png")
                      .then((data) => {
                        console.log(data);
                       setState({
                          some: data
                        });
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  }}
                >
                  Get Image
                </button> */}
                <button
                  onClick={() => {
                    canvas.current.eraseMode(false);
                  }}
                >
                  Pen
                </button>
                <button
                  onClick={() => {
                    canvas.current.eraseMode(true);
                  }}
                >
                  Eraser
                </button>
                <button
                  onClick={() => {
                    canvas.current.resetCanvas();
                  }}
                >
                  Reset
                </button>
              </div>
              <div className="md:order-1">
                <TabsContent value="complete" className="mt-0 border-0 p-0">
                  <div className="flex h-full flex-col space-y-4">
                    {/* <Textarea
                      placeholder="Write a tagline for an ice cream shop"
                      className="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]"
                    /> */}
                    <div className="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px">
                      <ReactSketchCanvas
                        width="1000px"
                        height="1000px"
                        ref={canvas}
                        onChange={(canvas) => {
                          setMe(true)
                          setCanvasData(canvas);
                        }}
                        strokeWidth={strokeWidth}
                        strokeColor={color} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        {/* <CounterClockwiseClockIcon className="h-4 w-4" /> */}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="insert" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                      <Textarea
                        placeholder="We're writing to [inset]. Congrats from OpenAI!"
                        className="h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px]"
                      />
                      <div className="rounded-md border bg-muted"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        {/* <CounterClockwiseClockIcon className="h-4 w-4" /> */}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="edit" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full gap-6 lg:grid-cols-2">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <Label htmlFor="input">Input</Label>
                          <Textarea
                            id="input"
                            placeholder="We is going to the market."
                            className="flex-1 lg:min-h-[580px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Fix the grammar."
                          />
                        </div>
                      </div>
                      <div className="mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[700px]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        {/* <CounterClockwiseClockIcon className="h-4 w-4" /> */}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  )
}

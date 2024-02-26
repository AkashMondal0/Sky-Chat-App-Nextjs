'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useCallback, useRef } from "react"
import { toolProps } from "../reducer"

export default function ToolDialog(
    {
        children,
        data,
        dispatch
    }: {
        children: React.ReactNode
        data: toolProps
        dispatch: any
    }
) {
    const ref = useRef(null);

    const colorChange = useCallback((color: string) => {
        dispatch({ type: "PEN_COLOR", payload: color })
    }, [dispatch])

    const sizeChange = useCallback((size: string) => {
        dispatch({ type: "STROKE_WIDTH", payload: size })
    }, [dispatch])


    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tools Setting</DialogTitle>
                    <DialogDescription>
                        {`Make changes to your profile here. Click save when you're done.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Color                        </Label>
                        <input type="color" value={data.PenColor}
                            className="w-10 h-10
                        flex-shrink-0
                        transition duration-300 ease-in-out
                        border-2 border-transparent"
                            onChange={(e) => colorChange(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Size
                        </Label>
                        <input type="range" min="1" max="15" step={1}
                            defaultValue={4}
                            className="w-60"
                            value={data.StrokeWidth}
                            onChange={(e) => sizeChange(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button type="submit">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

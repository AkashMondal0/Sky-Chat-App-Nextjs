import { Button } from "@/components/ui/button"
import { Eraser, Pencil, PencilRuler, Redo, RotateCcw, Undo } from "lucide-react"

function SideButtons({
    onUndo,
    onRedo,
    onClear,
    onEase,
    onPencil
  }: { 
    onUndo:()=>void,
    onRedo:()=>void,
    onClear:()=>void,
    onEase:()=>void,
    onPencil:()=>void
    }) {
    return <>
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 mt-2">
      <Button variant="secondary" className="rounded-full" onClick={onPencil}>
        <Pencil />
        </Button>
        <Button variant="secondary" className="rounded-full" onClick={onUndo}>
        <Undo />
        </Button>
        <Button variant="secondary" className="rounded-full" onClick={onRedo}>
        <Redo />
        </Button>
        <Button variant="secondary" className="rounded-full" onClick={onClear}>
        <RotateCcw />
        </Button>
        <Button variant="secondary" className="rounded-full" onClick={onEase}>
        <Eraser />
        </Button>
      </div>
    </>
  }

export default SideButtons
export interface toolProps {
    StrokeWidth: number;
    PenColor: string;
    width: number;
    height: number;
    canvasBackground: string;
    toggle: "document" | "Both" | "Canvas"
}


const initialToolState: toolProps = {
    StrokeWidth: 4,
    PenColor: "black",
    width: 0,
    height: 0,
    canvasBackground: "white",
    toggle: "Both",
}

const reducer = (state: toolProps, action: any) => {
    switch (action.type) {
        case "STROKE_WIDTH":
            return { ...state, StrokeWidth: action.payload }
        case "PEN_COLOR":
            return { ...state, PenColor: action.payload }
        case "CANVAS_SIZE":
            return { ...state, width: action.payload.width, height: action.payload.height }
        case "CANVAS_BACKGROUND":
            return { ...state, canvasBackground: action.payload }
        case "TOGGLE":
            return { ...state, toggle: action.payload }
        default:
            return state
    }
}

export { reducer, initialToolState }
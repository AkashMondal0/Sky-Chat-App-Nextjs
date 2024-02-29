import { User } from "@/interface/type";
import { Members_Sketch } from "./[docsId]/page";

interface AlertSketchRoom {
    open: boolean,
    data: {
        user: User | null,
        socketId: string | null,
        roomId: string | null
    }
}
export interface toolProps {
    StrokeWidth: number;
    StrokeEraser: number;
    PenColor: string;
    width: number;
    height: number;
    canvasBackground: string;
    toggle: "document" | "Both" | "Canvas"
    alert: AlertSketchRoom
}


const initialToolState: toolProps = {
    StrokeWidth: 4,
    StrokeEraser: 10,
    PenColor: "black",
    width: 0,
    height: 0,
    canvasBackground: "white",
    toggle: "Canvas",
    alert: {
        open: false,
        data: {
            user: null,
            socketId: null,
            roomId: null
        }
    }
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
        case "ALERT":
            return { ...state, alert: action.payload }
        case "ERASER_SIZE":
            return { ...state, StrokeEraser: action.payload }
        default:
            return state
    }
}

export interface RoomDataState {
    members: Members_Sketch[],
    canvasData: [],
    roomId: string | null,
    AuthorId: string | null
}

const initialRoomDataState: RoomDataState = {
    members: [],
    roomId: null,
    AuthorId: null,
    canvasData: [],
}

const roomReducer = (state: RoomDataState, action: any) => {
    switch (action.type) {
        case "SET_MEMBERS":
            // remove duplicate members 
            const members = action.payload.filter((v: Members_Sketch, i: number, a: Members_Sketch[]) => a.findIndex(t => (t.user?._id === v.user?._id)) === i)
            return { ...state, members }
        case "UPDATE_ROOM_ID":
            return { ...state, roomId: action.payload }
        case "SET_ROOM_DATA":
            return {
                ...state,
                canvasData: action.payload.canvasData,
                members: action.payload.members,
                roomId: action.payload.roomId,
                AuthorId: action.payload.AuthorId,
            }
        default:
            return state
    }
}



export {
    reducer,
    initialToolState,
    roomReducer,
    initialRoomDataState,
    getRandomColorPicker
}

 function getRandomColorPicker() {
        const colors = [
             "#FF0000",
             "#FFA500",
             "#FFFF00",
             "#008000",
             "#0000FF",
             "#4B0082",
             "#EE82EE",
             "#A9A9A9",
             "#FFA07A",
             "#20B2AA",
             "#FF4500",
             "#FFD700",
             "#00FF00",
             "#00FFFF",
             "#0000FF",
             "#800080",
             "#FF00FF",
             "#808080",
             "#FF6347",
             "#4682B4",
             "#800000",
             "#FFD700",
             "#008080",
             "#FF00FF",
             "#808080",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
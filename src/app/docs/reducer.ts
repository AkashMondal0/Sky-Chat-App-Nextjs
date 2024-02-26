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
    PenColor: string;
    width: number;
    height: number;
    canvasBackground: string;
    toggle: "document" | "Both" | "Canvas"
    alert: AlertSketchRoom
}


const initialToolState: toolProps = {
    StrokeWidth: 4,
    PenColor: "black",
    width: 0,
    height: 0,
    canvasBackground: "white",
    toggle: "Both",
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
    canvasData: []
}

const roomReducer = (state: RoomDataState, action: any) => {
    switch (action.type) {
        case "SET_MEMBERS":
            return { ...state, members: action.payload }
        case "UPDATE_ROOM_ID":
            return { ...state, roomId: action.payload }
        case "SET_ROOM_DATA":
            return {
                ...state,
                members: action.payload.members,
                roomId: action.payload.roomId,
                AuthorId: action.payload.AuthorId
            }
        default:
            return state
    }
}



export {
    reducer,
    initialToolState,
    roomReducer,
    initialRoomDataState
}
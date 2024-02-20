import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { localhost } from '../../../../keys';
import { socket } from '@/lib/socket';
import { GameRequest, PrivateChat, User } from '@/interface/type';
import { GameRequestToast } from '@/components/shared/MyAlert';


export const SendGameRequest = createAsyncThunk(
    'SendGameRequest/fetch',
    async (data: GameRequest, thunkApi) => {
        try {
            socket.emit('incoming_game_request_sender', data)
            return data
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

export interface GamesState {
    GameRequestNotification: GameRequest[]
}

const initialState: GamesState = {
    GameRequestNotification: []
};

// Define the slice
export const Games_Slice = createSlice({
    name: 'Games_Slice',
    initialState: initialState,
    reducers: {
        gameRequestSet: (state, action) => {
            if (state.GameRequestNotification.find((item) => item._id !== action.payload._id)) {
                state.GameRequestNotification.push(action.payload)
                return state
            }
        },
    },
    extraReducers: (builder) => {
        builder
    },
});

export const {
    gameRequestSet
} = Games_Slice.actions

export default Games_Slice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { localhost } from '../../../../keys';
import { socket } from '@/lib/socket';
import { PrivateChat, User } from '@/interface/type';


export const fetchSearchUser = createAsyncThunk(
    'searchKeyWord/fetch',
    async (searchKeyWord: string, thunkApi) => {
        try {
            const response = await axios.get(`${localhost}/user/search/${searchKeyWord}`);
            // console.log(response.data)
            return response.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'fetchUsers/fetch',
    async ({ users, authorId }: {
        users: string[];
        authorId: string;
    }, thunkApi) => {
        try {
            const response = await axios.post(`${localhost}/user/users`, {
                users, authorId
            });
            return response.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);

export const CreateConnectionUser = createAsyncThunk(
    'CreateConnectionUser/post',
    async (users: string[], thunkApi) => {
        try {
            const response = await axios.post(`${localhost}/private/chat/connection`, { users });
            socket.emit('update_Chat_List_Sender', {
                senderId: users[0],
                receiverId: users[1],
            });
            return response.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);


export interface UsersState {
    searchUser: User[];
    connectedUser: User[];
    loading: boolean;
    error: null | string | any;
    success: null | string | any | PrivateChat;
    updateList: "true" | "false" | boolean;
}

const initialState: UsersState = {
    searchUser: [],
    loading: false,
    error: null,
    success: null,
    connectedUser: [],
    updateList: false
};

// Define the slice
export const Users_Slice = createSlice({
    name: 'Users_Slice',
    initialState: initialState,
    reducers: {
        newData: (state, action) => {
            state.searchUser = action.payload;
        },
        resetUsersState: (state) => {
            state.searchUser = [];
            state.loading = false;
            state.error = null;
            state.success = null;
        },
        resetSuccess: (state) => {
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch search user
            .addCase(fetchSearchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSearchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.searchUser = action.payload;
            })
            .addCase(fetchSearchUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // Create connection
            .addCase(CreateConnectionUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CreateConnectionUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload;
            })
            .addCase(CreateConnectionUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // Fetch users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.connectedUser = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            .addDefaultCase((state) => {
                state.loading = false;
                state.error = null;
            });
    },
});

export const {
    newData,
    resetUsersState,
    resetSuccess
} = Users_Slice.actions

export default Users_Slice.reducer;
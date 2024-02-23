import { Status, User } from '@/interface/type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import { localhost } from '../../../../keys';
import { skyUploadImage, skyUploadVideo } from '@/lib/upload-file';
import { GetTokenLocal, Login, Logout, RemoveTokenLocal, SaveTokenLocal } from '../authentication';
import { getProfileConversation } from '../conversation';
import { socket } from '@/lib/socket';
export const createConnectionApi = createAsyncThunk(
  'createConnectionApi/post',
  async ({
    profileId,
    userId
  }: {
    profileId: string,
    userId: string
  }, thunkApi) => {
    try {
      const res = await axios.post(`${localhost}/private/chat/connection`, {
        users: [
          profileId, userId
        ]
      })
      return res.data
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);
export const fetchProfileData = createAsyncThunk(
  'profileData/fetch',
  async (token: string | null, thunkApi) => {
    try {
      token = token ? token : await GetTokenLocal() as string
      if (token) {
        const response = await axios.get(`${localhost}/auth/authorization`, {
          headers: {
            Authorization: token
          }
        })
        thunkApi.dispatch(Login({ token }))
        thunkApi.dispatch(getProfileConversation(token) as any)
        return response.data;
      } else {
        thunkApi.dispatch(Logout())
        return thunkApi.rejectWithValue('Token not found')
      }
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const QR_Login = createAsyncThunk(
  'QR_Login/fetch',
  async (token: string | null, thunkApi) => {
    try {
      token = token ? token : await GetTokenLocal() as string
      await SaveTokenLocal(token)
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const uploadStatusApi = createAsyncThunk(
  'uploadStatus/fetch',
  async ({
    _id,
    status
  }: {
    _id: string,
    status: Status[]
  }, thunkApi) => {
    try {

      for (let i = 0; i < status.length; i++) {
        if (status[i].type === 'image') {
          status[i].url = await skyUploadImage([status[i].url], _id).then(res => res.data[0])
        } else {
          status[i].url = await skyUploadVideo([status[i].url], _id).then(res => res.data[0])
        }
        status[i].createdAt = new Date().toISOString()
        status[i].seen = []
      }

      const data = {
        _id,
        status
      }
      await axios.post(`${localhost}/status/upload`, data)
      return data.status;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);


export interface Profile_State {
  user?: User | null
  loading?: boolean
  error?: string | null | any
  splashLoading?: boolean
  isLogin?: boolean
}

const initialState: Profile_State = {
  user: null,
  loading: false,
  error: null,
  splashLoading: true,
  isLogin: false
}

export const Profile_Slice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    profileUpdate: (state, action: PayloadAction<Profile_State>) => {
      state.user = action.payload.user
    },
    profileSet: (state, action: PayloadAction<Profile_State>) => {
      state.user = action.payload.user
    },
    resetProfileState: (state) => {
      state = initialState
      // socket.disconnect()
    },
    SplashLoading: (state, action: PayloadAction<boolean>) => {
      state.splashLoading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch authorize profile data
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.splashLoading = false
        state.isLogin = true
        socket.emit("user_connect", {
          user:action.payload,
          socketId:socket.id
        }) // connect to socket
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // upload status
      .addCase(uploadStatusApi.pending, (state,) => {
        state.loading = true;
      })
      .addCase(uploadStatusApi.fulfilled, (state, action) => {
        state.loading = false;
        state.user?.status?.push(...action.payload)
      })
      .addCase(uploadStatusApi.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

  },
})

// Action creators are generated for each case reducer function
export const {
  profileUpdate,
  profileSet,
  resetProfileState,
  SplashLoading
} = Profile_Slice.actions

export default Profile_Slice.reducer
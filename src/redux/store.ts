import { configureStore } from '@reduxjs/toolkit'
import { Authentication_Slice } from './slices/authentication'
import { Profile_Slice } from './slices/profile'
import { Conversation_Slice } from './slices/conversation'
import { Users_Slice } from './slices/users'


export const store = configureStore({
  reducer: {
    Authentication_Slice: Authentication_Slice.reducer,
    Profile_Slice: Profile_Slice.reducer,
    Conversation_Slice: Conversation_Slice.reducer,
    Users_Slice: Users_Slice.reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '@/lib/request';

interface UserState {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string
}

const initialState: UserState = {
  id: '',
  username: '',
  firstName: '',
  lastName: '',
  gender: '',
};

export const fetchUser = createAsyncThunk('user/fetchUser', async (token?: string) => {
  const headers = {} as any;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await request({
    url: '/api/user',
    method: 'GET',
    headers,
  });
  return res.data;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: () => initialState,
    setCurrentUser: (state, { payload }) => {
      state.id = payload.id;
      state.username = payload.username;
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.gender = payload.gender;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      const user = action.payload;
      state.id = user.id;
      state.username = user.username;
      state.firstName = user.firstName;
      state.lastName = user.lastName;
      state.gender = user.gender;
    });
  },
});

export const { resetUserState, setCurrentUser } = userSlice.actions;
export const userStateReducer = userSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '@/lib/request';
import { RequestStatus } from '@/type/request-status';
import { UserBloodPressures } from '@/type/user-blood-pressure';

interface UserBloodPressureState {
  userBloodPressuresStatus: RequestStatus,
  userBloodPressures: UserBloodPressures
}

const initialState: UserBloodPressureState = {
  userBloodPressuresStatus: RequestStatus.IDLE,
  userBloodPressures: [],
};

export const fetchUserBloodPressureList = createAsyncThunk(
  'userBloodPressureList',
  async () => {
    const res = await request<{ data: UserBloodPressures }>({
      method: 'GET',
      url: '/api/user_blood_pressures',
    });
    return res.data;
  },
);

export const userBloodPressureSlice = createSlice({
  name: 'userBloodPressure',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserBloodPressureList.pending, (state) => {
      state.userBloodPressuresStatus = RequestStatus.LOADING;
    });
    builder.addCase(fetchUserBloodPressureList.fulfilled, (state, { payload }) => {
      state.userBloodPressuresStatus = RequestStatus.SUCCEEDED;
      state.userBloodPressures = payload.map((p) => ({ ...p }));
    });
    builder.addCase(fetchUserBloodPressureList.rejected, (state) => {
      state.userBloodPressuresStatus = RequestStatus.FAILED;
      state.userBloodPressures = [];
    });
  },
});

// export const {  } = userBloodPressureSlice.actions;
export const userBloodPressureSliceReducer = userBloodPressureSlice.reducer;
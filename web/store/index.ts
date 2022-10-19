import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userStateReducer } from '@/slices/user-slice';
import { userBloodPressureSliceReducer } from '@/slices/user-blood-pressure-slice';

const reducer = combineReducers({
  user: userStateReducer,
  userBloodPressure: userBloodPressureSliceReducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

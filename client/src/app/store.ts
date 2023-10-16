import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authSlice from '../redux/authSlice';
import alertReducer from '../redux/alertSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    alert: alertReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

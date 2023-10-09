import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import recipesReducer from '../redux/recipesSlice';
import authSlice from '../redux/authSlice';
import alertReducer from '../redux/alertSlice';

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
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

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import recipesReducer from '../features/recipesSlice';
import alertReducer from '../features/alertSlice';

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
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

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import recipesReducer from '../features/recipes/recipesSlice';

export const store = configureStore({
  reducer: {
    recipes: recipesReducer
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

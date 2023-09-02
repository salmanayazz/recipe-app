import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../app/store';
import axios from 'axios';

interface AuthState {
  user: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string | null>) => {
      state.user = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, setError, clearError, logoutUser } = authSlice.actions;

// Async Thunks for API Calls

// Create a reusable function to handle API errors
const handleApiError = (error: any, dispatch: any) => {
  const errorMessage = error.response?.data?.message || 'An error occurred';
  dispatch(setError(errorMessage));
};

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  withCredentials: true,
});

// Define async thunks for API calls
export const signupUser = (userData: { username: string; password: string }): AppThunk => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    dispatch(clearError());
    dispatch(setUser(userData.username));
  } catch (error) {
    handleApiError(error, dispatch);
  }
};

export const loginUser = (userData: { username: string; password: string }): AppThunk => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/login', userData);
    dispatch(clearError());
    dispatch(setUser(userData.username));
  } catch (error) {
    handleApiError(error, dispatch);
  }
};

export const logoutUserAsync = (): AppThunk => async (dispatch) => {
  try {
    const response = await axiosInstance.delete('/auth/logout');
    dispatch(clearError());
    dispatch(logoutUser());
  } catch (error) {
    handleApiError(error, dispatch);
  }
};

export default authSlice.reducer;
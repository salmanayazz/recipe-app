import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../app/store';
import axios from 'axios';

export interface User {
  username: string;
}

interface AuthState {
  user: User | undefined;
  error: string | undefined;
}

const storedUsername = localStorage.getItem('user');
const initialState: AuthState = {
  // get username from local storage if it exists
  user: storedUsername !== null ? { username: storedUsername } : undefined,
  error: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = {
        username: action.payload?.username || "unknown",
      };
      state.error = undefined;
      localStorage.setItem('user', state.user.username);
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
      
    },
    clearError: (state) => {
      state.error = undefined;
    },
    logoutUser: (state) => {
      state.user = undefined;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, setError, clearError, logoutUser } = authSlice.actions;

const handleApiError = (error: any, dispatch: any) => {
  const errorMessage = error.response?.data?.message || 'An error occurred';
  dispatch(setError(errorMessage));
};

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  withCredentials: true,
});

// async thunks for API calls
export const signupUserAsync = (userData: { username: string; password: string }): AppThunk => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    dispatch(clearError());
    dispatch(setUser(userData)); // todo: change these to response data
  } catch (error) {
    handleApiError(error, dispatch);
  }
};

export const loginUserAsync = (userData: { username: string; password: string }): AppThunk => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/login', userData);
    dispatch(clearError());
    dispatch(setUser(userData));
  } catch (error) {
    handleApiError(error, dispatch);
  }
};

export const logoutUserAsync = (): AppThunk => async (dispatch) => {
  try {
    const response = await axiosInstance.delete('/auth/logout');
    console.log(response);
    dispatch(clearError());
    dispatch(logoutUser());
  } catch (error) {
    handleApiError(error, dispatch);
  }
};

export default authSlice.reducer;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
import React, { useState, createContext, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';
import { get } from 'http';

export interface User {
    username: string;
}

interface AuthState {
    user: User | undefined;
    loading: boolean;
}

interface AuthContextType {
    state: AuthState;
    signupUser: (userData: { username: string; password: string }) => void;
    loginUser: (userData: { username: string; password: string }) => void;
    logoutUser: () => void;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND,
    withCredentials: true,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({ user: undefined, loading: false });

    useEffect(() => {
        getUser();
    }, []);

    const signupUser = async (userData: { username: string; password: string }) => {
        try {
            setState({ ...state, loading: true });
            await axiosInstance.post(`${process.env.REACT_APP_BACKEND}/auth/signup`, userData);
            getUser();
        } catch (error) {
            console.log(error);
        }
    }

    const loginUser = async (userData: { username: string; password: string }) => {
        try {
            setState({ ...state, loading: true });
            let response = await axiosInstance.post(`${process.env.REACT_APP_BACKEND}/auth/login`, userData);
            setState({ ...state, user: response.data.user, loading: false });
        } catch (error) {
            console.log(error);
            setState({ ...state, loading: false });
        }
    }

    const logoutUser = async () => {
        try {
            setState({ ...state, loading: true });
            await axiosInstance.delete(`${process.env.REACT_APP_BACKEND}/auth/logout`);
            setState({...state, loading: false, user: undefined})
        } catch (error) {
            setState({ ...state, loading: false });
            console.log(error);
        }
    }

    const getUser = async () => {
        try {
            setState({ ...state, loading: true });
            const response = await axiosInstance.get(`${process.env.REACT_APP_BACKEND}/auth/login`);
            setState({ ...state, user: response.data.user, loading: false});
        } catch (error) {
            setState({ ...state, loading: false });
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{ 
            state, 
            signupUser,
            loginUser,
            logoutUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
import React, { useState, createContext, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

export interface User {
    username: string;
}

interface AuthState {
    user: User | undefined;
    loading: boolean;
}

interface AuthContextType {
    authState: AuthState;
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
    baseURL: import.meta.env.VITE_BACKEND,
    withCredentials: true,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({ user: undefined, loading: false });

    useEffect(() => {
        getUser();
    }, []);

    const signupUser = async (userData: { username: string; password: string }) => {
        try {
            setAuthState({ ...authState, loading: true });
            await axiosInstance.post(`auth/signup`, userData);
            getUser();
        } catch (error) {
            console.log(error);
        }
    }

    const loginUser = async (userData: { username: string; password: string }) => {
        try {
            setAuthState({ ...authState, loading: true });
            let response = await axiosInstance.post(`auth/login`, userData);
            setAuthState({ ...authState, user: response.data.user, loading: false });
        } catch (error) {
            console.log(error);
            setAuthState({ ...authState, loading: false });
        }
    }

    const logoutUser = async () => {
        try {
            setAuthState({ ...authState, loading: true });
            await axiosInstance.delete(`auth/logout`);
            setAuthState({...authState, loading: false, user: undefined})
        } catch (error) {
            setAuthState({ ...authState, loading: false });
            console.log(error);
        }
    }

    const getUser = async () => {
        try {
            setAuthState({ ...authState, loading: true });
            const response = await axiosInstance.get(`auth/login`);
            setAuthState({ ...authState, user: response.data.user, loading: false});
        } catch (error) {
            setAuthState({ ...authState, loading: false });
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{ 
            authState, 
            signupUser,
            loginUser,
            logoutUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
import React, { ReactNode, useEffect, useState } from 'react';
import { AuthContext, AuthState } from './AuthContext';
import { axiosInstance } from '../AxiosInstance';

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
            const response = await axiosInstance.post(`auth/login`, userData);
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
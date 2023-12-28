import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext, AuthState, AuthError } from "./AuthContext";
import { axiosInstance } from "../AxiosInstance";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
    loading: false,
  });

  useEffect(() => {
    getUser();
  }, []);

  /**
   * signup user, get user data and set user session
   * @returns
   * an AuthError object if there is an error
   */
  async function signupUser(userData: {
    username: string;
    password: string;
  }): Promise<AuthError | undefined> {
    try {
      setAuthState({ ...authState, loading: true });
      await axiosInstance.post(`auth/signup`, userData);
      getUser();
    } catch (error: any) {
      console.log(error);
      setAuthState({
        ...authState,
        loading: false,
      });
      return error?.response?.data || { other: error.message };
    }
    return;
  }

  /**
   * login user, get user data and set user session
   * @returns
   * an AuthError object if there is an error
   */
  const loginUser = async (userData: {
    username: string;
    password: string;
  }): Promise<AuthError | undefined> => {
    try {
      setAuthState({ ...authState, loading: true });
      const response = await axiosInstance.post(`auth/login`, userData);
      setAuthState({ ...authState, user: response.data.user, loading: false });
    } catch (error: any) {
      console.log(error);
      setAuthState({
        ...authState,
        loading: false,
      });
      return error?.response?.data || { other: error?.message };
    }
    return;
  };

  /**
   * delete user session
   * @returns
   * an AuthError object if there is an error
   */
  const logoutUser = async (): Promise<AuthError | undefined> => {
    try {
      setAuthState({ ...authState, loading: true });
      await axiosInstance.delete(`auth/logout`);
      setAuthState({ ...authState, loading: false, user: undefined });
    } catch (error: any) {
      setAuthState({ ...authState, loading: false });
      return error?.response?.data || { other: error?.message };
    }
    return;
  };

  /**
   * check is user session is still valid and get user data
   */
  const getUser = async () => {
    try {
      setAuthState({ ...authState, loading: true });
      const response = await axiosInstance.get(`auth/login`);
      setAuthState({ ...authState, user: response.data.user, loading: false });
    } catch (error: any) {
      setAuthState({ ...authState, loading: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        signupUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

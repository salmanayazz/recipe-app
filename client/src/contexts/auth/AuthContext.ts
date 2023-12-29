import { createContext, useContext } from "react";

export interface User {
  username: string;
}

export interface AuthState {
  user: User | undefined;
  loading: boolean;
}

export interface AuthError {
  username?: string;
  password?: string;
  other?: string;
}

export interface AuthContextType {
  authState: AuthState;
  signupUser: (userData: {
    username: string;
    password: string;
  }) => Promise<AuthError | undefined>;
  loginUser: (userData: {
    username: string;
    password: string;
  }) => Promise<AuthError | undefined>;
  logoutUser: () => Promise<AuthError | undefined>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

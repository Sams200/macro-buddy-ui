import React, { createContext, useEffect, useReducer, ReactNode } from 'react';
import { User } from '../models/user';
import { getCurrentUser } from '../api/userApi';
import { signIn as apiSignIn, signOut as apiSignOut } from '../api/authApi';
import { SignInRequest } from '../models/auth';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
            };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

interface AuthContextType extends AuthState {
    signIn: (data: SignInRequest) => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    ...initialState,
    signIn: async () => {},
    signOut: async () => {},
    clearError: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                console.log("Checking auth status...");
                dispatch({ type: 'LOGIN_START' });

                // Try to get the current user
                const user = await getCurrentUser();
                console.log("User authenticated:", user);
                dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            } catch (error: any) {
                console.log("Authentication check failed:", error.message || error);
                dispatch({ type: 'LOGIN_FAILURE', payload: error.message || 'Session expired' });
            }
        };

        checkAuthStatus();
    }, []);

    const signIn = async (data: SignInRequest) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            await apiSignIn(data);
            const user = await getCurrentUser();
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error: any) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.message || 'Failed to sign in',
            });
        }
    };

    const signOut = async () => {
        try {
            await apiSignOut();
        } finally {
            dispatch({ type: 'LOGOUT' });
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                signIn,
                signOut,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
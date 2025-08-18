import React, {createContext, ReactNode, Reducer, useContext, useEffect, useReducer, useState} from 'react';
import {initialLoginState, loginReducer, LoginState} from '../state/login/login.reducer';
import {LoginActionTypes, loginFailure, loginStart, loginSuccess, logout} from '../state/login/login.action';
import axiosClient from '../axios/axiosClient';
import {useLocation, useNavigate} from 'react-router-dom';
import {useQueue} from "../graphql/graphql-subscrption";
import {useAppContext} from "./app.context";

export enum AuthProvider {
    GOOGLE = "GOOGLE",
    LOCAL = "LOCAL"
}

export enum AccountStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    DEACTIVATE = "DEACTIVATE"
}

export interface User {
    id?: string | null;
    email?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    address?: string | null;
    profile?: string | null;
    contact?: string | null;
    imageUrl?: string | null;
    createdAt?: number;
    nic?: string | null;
    provider?: AuthProvider | null;
    accountStatus?: AccountStatus
    authKey?: string | null;
}

interface LoginContextType extends LoginState {
    dispatch: React.Dispatch<LoginActionTypes>;
    loginUser: (user: User) => Promise<void>;
    logoutUser: () => void;
    refreshToken: () => void;
    isInitialized: boolean;
}

export const LoginContext = createContext<LoginContextType>({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    isInitialized: false,
    dispatch: () => {
    },
    loginUser: async () => {
    },
    logoutUser: () => {
    },
    refreshToken: () => {
    }
} as LoginContextType);

export const LoginContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {unsubscribe} = useQueue();
    const {appContext} = useAppContext()
    const [state, dispatch] = useReducer<Reducer<LoginState, LoginActionTypes>>(
        loginReducer,
        initialLoginState
    );
    const [isInitialized, setIsInitialized] = useState(false);

    const publicRoutes = ['/login', '/signup', '/splash', '/view-ticket', '/registration'];
    const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

    const checkAuthStatus = async (): Promise<boolean> => {
        const token = localStorage.getItem("token");

        if (token) {
            dispatch(loginStart());
            try {
                const response = await axiosClient.get('/auth/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: 'json'
                });
                const userData = response.data?.data?.user;
                const newToken = response.data?.data?.token;

                if (userData && newToken) {
                    localStorage.setItem("token", newToken);
                    dispatch(loginSuccess(userData));
                    return true;
                } else {
                    localStorage.removeItem("token");
                    dispatch(loginFailure("Session expired"));
                    return false;
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                localStorage.removeItem("token");
                dispatch(loginFailure("Authentication failed"));
                return false;
            }
        } else {
            return false;
        }
    };

    // Initialize authentication state on app startup
    useEffect(() => {
        const initializeAuth = async () => {
            const isAuthenticated = await checkAuthStatus();
            setIsInitialized(true);

            // Only redirect after initialization is complete
            if (!isAuthenticated && !isPublicRoute) {
                navigate("/login", {replace: true});
            }
        };

        initializeAuth();
    }, []); // Run only once on mount

    // Handle navigation after initialization
    useEffect(() => {
        if (isInitialized && !state.isAuthenticated && !isPublicRoute) {
            navigate("/login", {replace: true});
        }
    }, [location.pathname, state.isAuthenticated, isPublicRoute, isInitialized]);

    // Periodic token verification
    // useEffect(() => {
    //     const handleVisibilityChange = () => {
    //         if (document.visibilityState === 'visible' && !isPublicRoute && state?.isAuthenticated) {
    //             // checkAuthStatus();
    //         }
    //     };
    //
    //     let tokenCheckInterval: any | null = null;
    //
    //     if (!isPublicRoute && state.isAuthenticated && isInitialized) {
    //         tokenCheckInterval = setInterval(async () => {
    //             const isValid = await checkAuthStatus();
    //             if (!isValid) {
    //                 navigate("/login", {replace: true});
    //             }
    //         }, 30 * 60 * 1000);
    //         document.addEventListener('visibilitychange', handleVisibilityChange);
    //     }
    //
    //     return () => {
    //         if (tokenCheckInterval) {
    //             clearInterval(tokenCheckInterval);
    //         }
    //         document.removeEventListener('visibilitychange', handleVisibilityChange);
    //     };
    // }, [isPublicRoute, state.isAuthenticated, isInitialized]);

    const refreshToken = async () => {
        await checkAuthStatus();
    };

    const loginUser = async (user: User) => {
        dispatch(loginStart());
        try {
            const response = await axiosClient.post('/auth/login', user, {responseType: 'json'});
            const userData = response.data?.data?.user as User;
            if (userData.provider === AuthProvider.LOCAL && userData.accountStatus === AccountStatus.PENDING) {
                dispatch(loginFailure("Your account has not verify please check the mail and verify"));
            }else if(userData.accountStatus === AccountStatus.DEACTIVATE){
                dispatch(loginFailure("Your account has been deactivated, Please contact administration."));
            } else {
                const token = response.data?.data?.token;
                if (userData && token) {
                    dispatch(loginSuccess(userData));
                    localStorage.setItem("token", token);
                    navigate("/menu", {replace: true});
                } else {
                    dispatch(loginFailure("Invalid login response"));
                }
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            console.error(error);
            dispatch(loginFailure(errorMessage));
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        unsubscribe();
        dispatch(logout());

        navigate("/login", {replace: true});
    };

    const contextValue: LoginContextType = {
        ...state,
        dispatch,
        loginUser,
        logoutUser,
        refreshToken,
        isInitialized
    };

    // Don't render children until auth state is initialized
    if (!isInitialized) {
        return <div>Loading...</div>; // or your loading component
    }

    return (
        <LoginContext.Provider value={contextValue}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = (): LoginContextType => {
    const context = useContext(LoginContext);
    if (context === undefined) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
};

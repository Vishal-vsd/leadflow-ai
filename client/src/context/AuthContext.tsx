import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe, logout as logoutUser } from "@/services/authService";
import type { User } from "../types/authTypes";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    //const isAuthenticated = user !== null

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await getMe();
                setUser(response.data)
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        restoreSession()
    }, [])

    const isAuthenticated = !!user

    const logout = async () => {
        try {
            await logoutUser()
        } finally{
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                loading,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

//custom hook

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        )
    }

    return context;
}
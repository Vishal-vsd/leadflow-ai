import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe } from "@/services/authService";
import type { User } from "../types/authTypes";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    //const isAuthenticated = user !== null

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await getMe();
                setUser(response.data)
            } catch (error) {
                setUser(null)
            }
        }

        restoreSession()
    }, [])

    const isAuthenticated = !!user
    
    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
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
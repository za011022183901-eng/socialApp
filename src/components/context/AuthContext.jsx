import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('tkn'));
    const [userIdd, setUserId] = useState('');

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.user || decoded.id || '');
            } catch (error) {
                setUserId('');
            }
        }
    }, [token]);

    const userQuery = useQuery({
        queryKey: ['userData'],
        queryFn: async () => {
            const tkn = localStorage.getItem('tkn');
            if (!tkn) throw new Error("No token");
            
            return await axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
                headers: { token: tkn }
            });
        },
        enabled: !!token, 
        staleTime: 1000 * 60 * 60, // ساعة كاملة
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false 
    });

    return (
        <AuthContext.Provider value={{ 
            token, 
            setToken, 
            userIdd, 
            userProfileData: userQuery.data?.data?.user, 
            isUserLoading: userQuery.isLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
}
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    console.log("AutProvider\n")
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token =localStorage.getItem('token')
    useEffect(() => {
        console.log("AutProvider | useEffect:\n")
        // Check if user is logged in on component mount
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        console.log("StoredUser: ",storedUser)
        console.log("token: ", token)
        
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
     
    }, []);

    const login = (userData, token) => {
        console.log('Login called with:', { userData, token }); // Debug log        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                login, 
                logout, 
                updateUser,
                token,
                loading 
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
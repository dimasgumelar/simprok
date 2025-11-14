import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children, initialUser }) => {
    const [user, setUser] = useState(() => {
        // Gunakan data initialUser hanya saat pertama kali
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : initialUser;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


// Define the shape of the context data
interface UsersContextProps {
    users: any; // Adjust the type based on the expected structure of your settings
    isLoading: boolean;
    error: string | null | undefined;
    refetchSettings: () => void;
}

// Create the context
const UsersContext = createContext<UsersContextProps | undefined>(undefined);

// Fetch function for settings
const fetchUsers = async () => {
    const response = await axios.get(`${import.meta.env.VITE_URL}/users`); // Replace with your API endpoint
    return response.data; // Adjust based on your API response structure
};

// Create a provider component
export const UsersProvider = ({ children }: { children: ReactNode }) => {
    // Use React Query to fetch settings
    const { data, isLoading, error, refetch } = useQuery({queryKey: ['settings'], queryFn: fetchUsers, refetchOnMount: true, refetchOnWindowFocus: true,});

    return (
        <UsersContext.Provider value={{ users: data, isLoading, error: error?.message, refetchSettings: refetch }}>
            {children}
        </UsersContext.Provider>
    );
};

// Create a custom hook to use the SettingsContext
export const useUsers = () => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

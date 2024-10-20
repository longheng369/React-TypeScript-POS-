import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


// Define the shape of the context data
interface SettingsContextProps {
    settings: any; // Adjust the type based on the expected structure of your settings
    isLoading: boolean;
    error: string | null | undefined;
    refetchSettings: () => void;
}

// Create the context
const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

// Fetch function for settings
const fetchSettings = async () => {
    const response = await axios.get(`${import.meta.env.VITE_URL}/settings`); // Replace with your API endpoint
    return response.data; // Adjust based on your API response structure
};



// Create a provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    // Use React Query to fetch settings
    const { data, isLoading, error, refetch } = useQuery({queryKey: ['settings'], queryFn: fetchSettings, refetchOnMount: true, refetchOnWindowFocus: true,});

    return (
        <SettingsContext.Provider value={{ settings: data, isLoading, error: error?.message, refetchSettings: refetch }}>
            {children}
        </SettingsContext.Provider>
    );
};

// Create a custom hook to use the SettingsContext
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

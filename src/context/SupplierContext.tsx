import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


// Define the shape of the context data
interface SuppliersContextProps {
    suppliers: any; // Adjust the type based on the expected structure of your settings
    isLoading: boolean;
    error: string | null | undefined;
    refetchSettings: () => void;
}

// Create the context
const SuppliersContext = createContext<SuppliersContextProps | undefined>(undefined);

// Fetch function for settings
const fetchSuppliers = async () => {
    const response = await axios.get(`${import.meta.env.VITE_URL}/suppliers`); // Replace with your API endpoint
    return response.data.data; // Adjust based on your API response structure
};

// Create a provider component
export const SupplierProvider = ({ children }: { children: ReactNode }) => {
    // Use React Query to fetch settings
    const { data, isLoading, error, refetch } = useQuery({queryKey: ['suppliers'], queryFn: fetchSuppliers, refetchOnMount: true, refetchOnWindowFocus: true,});

    return (
        <SuppliersContext.Provider value={{ suppliers: data, isLoading, error: error?.message, refetchSettings: refetch }}>
            {children}
        </SuppliersContext.Provider>
    );
};

// Create a custom hook to use the SettingsContext
export const useSuppliers = () => {
    const context = useContext(SuppliersContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

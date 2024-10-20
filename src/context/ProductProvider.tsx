import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


// Define the shape of the context data
interface ProductsContextProps {
    products: any; // Adjust the type based on the expected structure of your settings
    isLoading: boolean;
    error: string | null | undefined;
    refetchProducts: () => void;
}

// Create the context
const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

// Fetch function for settings
const fetchProducts = async () => {
    const response = await axios.get(`${import.meta.env.VITE_URL}/products`); // Replace with your API endpoint
    return response.data; // Adjust based on your API response structure
};



// Create a provider component
export const ProductProvider = ({ children }: { children: ReactNode }) => {
    // Use React Query to fetch settings
    const { data, isLoading, error, refetch } = useQuery({queryKey: ['products'], queryFn: fetchProducts, refetchOnMount: true, refetchOnWindowFocus: true,});

    return (
        <ProductsContext.Provider value={{ products: data, isLoading, error: error?.message, refetchProducts: refetch }}>
            {children}
        </ProductsContext.Provider>
    );
};

// Create a custom hook to use the SettingsContext
export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within a SettingsProvider');
    }
    return context;
};

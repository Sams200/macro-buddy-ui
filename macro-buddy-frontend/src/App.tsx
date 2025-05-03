import React from 'react';
import AppRoutes from './routes';
import './styles/global.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnReconnect: true,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            retry: 3,
            staleTime: 1000 * 5,
        },
    },
});

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AppRoutes/>
        </QueryClientProvider>
    )
};

export default App;
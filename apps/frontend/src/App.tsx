import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { QueryClient, QueryClientProvider } from '@/services/QueryClient';

// Initialize the query client
const queryClient = QueryClient();

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
      <Router />
      </QueryClientProvider>
    </MantineProvider>
  );
}

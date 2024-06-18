import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { QueryClient, QueryClientProvider } from '@/services/QueryClient';
import { Notifications } from '@mantine/notifications';

// Initialize the query client
const queryClient = QueryClient();

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <QueryClientProvider client={queryClient}>
      <Router />
      </QueryClientProvider>
    </MantineProvider>
  );
}

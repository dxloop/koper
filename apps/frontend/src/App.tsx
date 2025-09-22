import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Router } from './Router';
import { theme } from './theme';
import { QueryClient, QueryClientProvider } from '@/services/QueryClient';

// Initialize the query client
const queryClient = QueryClient();

/**
 * The main App component that wraps the application with necessary providers.
 * @returns The App component.
 */
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

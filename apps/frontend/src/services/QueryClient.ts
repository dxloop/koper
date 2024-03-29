import { QueryClient as QC } from '@tanstack/react-query';

export { QueryClientProvider } from '@tanstack/react-query';

/**
 * The QueryClient instance
 * @returns The QueryClient instance 
 */
export const QueryClient = () => new QC();

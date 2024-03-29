import { UseFormReturnType } from '@mantine/form';

/**
 * The props for the Authentication component
 */
export interface AuthenticationFormProps {
    form: UseFormReturnType<{
        email: string;
        password: string;
    }>;
    errorMessage: string | null;
    handleAuthentication: () => void;
    submitComponent: React.ReactNode;
}

import { UseFormReturnType } from '@mantine/form';

/**
 * The props for the Authentication component
 */
export interface AuthenticationFormProps {
  form: UseFormReturnType<{
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    terms: boolean;
  }>;
  errorMessage: string | null;
  handleAuthentication: () => void;
  submitComponent: React.ReactNode;
}

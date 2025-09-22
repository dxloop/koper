import { AuthenticationForm } from '../components/authentication/Authentication/Authentication';
import { Background } from '../components/layout/Background/Background';

/**
 * Displays the authentication page.
 * @returns The authentication page.
 */
export function AuthenticationPage() {
  return (
    <>
      <Background>
        <AuthenticationForm />
      </Background>
    </>
  );
}

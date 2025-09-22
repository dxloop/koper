import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGetSelfUser } from 'openapi';
import { AppBody } from '../../layout/Body/Body';
import { getJWT, removeJWT } from '@/services/util/Auth';

/**
 * Verify user authentication and redirect to the login page if not authenticated.
 * @returns The secured route.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  // Check if the user is authenticated
  if (!getJWT()) {
    return <Navigate to="/login" />;
  }

  const userQuery = useGetSelfUser();
  useEffect(() => {
    if (userQuery.isError) {
      // Token is faulty, so redirect to login page
      removeJWT();
      nav('/login');
    }
  }, [userQuery.isError, nav]);

  if (userQuery.isSuccess) {
    return <AppBody>{children}</AppBody>;
  }

  return null;
}

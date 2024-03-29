import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { ProtectedRoute } from './components/authentication/ProtectedRoute/ProtectedRoute';
import { AuthenticationPage } from './pages/Authentication.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },
  {
    path: '/login',
    element: <AuthenticationPage />,
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}

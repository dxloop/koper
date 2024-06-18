import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { ProtectedRoute } from './components/authentication/ProtectedRoute/ProtectedRoute';
import { AuthenticationPage } from './pages/Authentication.page';
import { SettingsPage } from './pages/Settings.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },
  {
    path: '/login',
    element: <AuthenticationPage />,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}

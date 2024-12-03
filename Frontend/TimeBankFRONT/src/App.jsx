// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './Login/AuthContext';  // Asegúrate de que el AuthProvider esté correctamente importado
import Layout from './Layout/layout';
import Prestamo from './Prestamo/Prestamo';
import Convert from './Conversor/convert';
import HelpCenter from './Help/Helpcenter';
import Cuentas from './Cuentas/Cuentas';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Tarjetas from './Tarjetas/Tarjetas';
import ProtectedRoute from './Login/ProtectedRoute'; 
import LandPage from './Inicio/Inicio';
import Transferencias from './Transferencias/Transferencias';
import Prestamos from './Prestamo/Prestamo';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/inicio',
        element: <ProtectedRoute element={<LandPage />} />,  // Ruta protegida
      },
      {
        path: '/transferencias',
        element: <ProtectedRoute element={<Transferencias />} />,  // Ruta protegida
      },
      {
        path: '/login',
        element: <Login />,  // Ruta de login
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/prestamos',
        element: <ProtectedRoute element={<Prestamos />} />,  // Ruta protegida
      },
      {
        path: '/cuentas',
        element: <ProtectedRoute element={<Cuentas />} />,
      },
      {
        path: '/tarjetas',
        element: <ProtectedRoute element={<Tarjetas />} />,
      },
      {
        path: '/convertidor',
        element: <ProtectedRoute element={<Convert />} />,
      },
      {
        path: '/helpcenter',
        element: <HelpCenter />,
      },
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;

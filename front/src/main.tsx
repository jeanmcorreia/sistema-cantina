import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard.tsx';
import Produtos from './pages/Produtos.tsx';
import './globals.css';
import Clientes from './pages/Clientes.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Pedidos from './pages/Pedidos.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/produtos',
        element: <Produtos />,
      },
      {
        path: '/clientes',
        element: <Clientes />,
      },
      {
        path: '/pedidos',
        element: <Pedidos />,
      },
    ],
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

const client = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

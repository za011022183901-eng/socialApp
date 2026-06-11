import React, { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './componanet/Layout/Layout';
import Login from './componanet/Login/Login';
import Register from './componanet/Register/Register';
import NotFoutPage from './componanet/NotFountPage/NotFoutPage';
import Home from './componanet/Home/Home';
import AuthContext from './componanet/context/AuthContext';
import Profile from './componanet/Profile/Profile';
import ProductedRoute from './componanet/ProductedRoute/ProductedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// التعديل هنا: شيلنا الـ .JSX الكبيرة تماماً لتفادي خطأ Vite
import PostDetails from './componanet/PostDetails/PostDetails'; 
import ErrorBoundary from './components/ErrorBoundary';


const router = createBrowserRouter([
  { 
    path: '', 
    element: <Layout />, 
    children: [
      { path: '/login', element: <Login /> },

      { path: '/register', element: <Register /> },

      { path: '/home', element: (
        <ErrorBoundary>
          <ProductedRoute> <Home /> </ProductedRoute>
        </ErrorBoundary>
      ) }, 






    //// /// ///////////////////////////

      { path: '/PostDetails/:id', element: (
        <ErrorBoundary>
          <ProductedRoute> <PostDetails /> </ProductedRoute>
        </ErrorBoundary>
      ) }, //////////////



//////////////////////////////////


















      { path: '/', element: <ProductedRoute> <Home /> </ProductedRoute> }, 

      { path: '/profile', element: <ProductedRoute> <Profile /> </ProductedRoute> }, 
      { path: '*', element: <NotFoutPage /> }
    ] 
  },
])

function App() {
  const client = new QueryClient()

  return (
    <>
      <AuthContext>
        <QueryClientProvider client={client}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext>
    </>
  )
}

export default App
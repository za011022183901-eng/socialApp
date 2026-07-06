import React, { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NotFoutPage from './components/NotFountPage/NotFoutPage';
import Home from './components/Home/Home';
import AuthContext from './components/context/AuthContext';
import Profile from './components/Profile/Profile';
import ProductedRoute from './components/ProductedRoute/ProductedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostDetails from './components/PostDetails/PostDetails'; 
import ErrorBoundary from './components/ErrorBoundary';
import GetUserPosts from './components/getUserPosts/GetUserPosts';
import { ToastContainer } from 'react-toastify';

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
      { path: '/PostDetails/:id', element: (
        <ErrorBoundary>
          <ProductedRoute> <PostDetails /> </ProductedRoute>
        </ErrorBoundary>
      ) }, 
      { path: '/', element: <ProductedRoute> <Home /> </ProductedRoute> }, 
      { path: '/profile', element: <ProductedRoute> <Profile /> </ProductedRoute> }, 
      { path: '/getUserPosts/:id', element: <ProductedRoute> <GetUserPosts/> </ProductedRoute> }, 
      { path: '*', element: <NotFoutPage /> }
    ] 
  },
])

// 💥 1. نقلنا الـ client بره الكومبوننت تماماً عشان يحافظ على الـ Cache وميعملش ريستارت مع كل رندر لـ App
const client = new QueryClient()

function App() {
  return (
    <>
      {/* 💥 2. التعديل السحري: الـ QueryClientProvider بقى هو الأب الكبير بره خالص */}
      <QueryClientProvider client={client}>
        {/* الـ AuthContext جواه دلوقتي فيقدر يستخدم الـ useQuery براحته وبدون مشاكل */}
        <AuthContext>
          <RouterProvider router={router} />
        </AuthContext>
      </QueryClientProvider>

      <ToastContainer />
    </>
  )
}

export default App
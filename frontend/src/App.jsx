import React, { useEffect } from 'react'
import './App.css'
import {Routes, Route, Navigate} from "react-router-dom"

import Navbar from './components/Navbar.jsx'
import HomePage from "./pages/HomePage.jsx"
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import { axiosInstance } from '../lib/axios.js'
import { useAuthStore } from './store/useAuthStore.js'

import {Loader} from "lucide-react";
import LandingPage from './pages/LandingPage.jsx'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'


function App() {

  const {authUser, checkAuth, ischeckingAuth,onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  console.log(onlineUsers);

  useEffect(() =>{
    checkAuth();
  },[checkAuth]);

   // 🟡 Set the selected theme globally
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  if(ischeckingAuth && !authUser) return (
     <div className="flex items-center justify-center h-screen">
    <Loader className="size-10 animate-spin text-gray-600" />
  </div>
  )

  return (
    <div data-theme={theme}>
      <Navbar/>
       
       <Routes>
        <Route path='/' element={<LandingPage/>}/>

        {/* <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} /> */}
       
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/settings' element={authUser ?<SettingsPage/> : <Navigate to="/login"/>} />
        <Route path='/profile' element={authUser ?<ProfilePage/> : <Navigate to="/login"/>} />
         <Route path='/home' element={authUser ?<HomePage/> : <Navigate to="/login"/>} />
       </Routes>
      <Toaster/>
    </div>
  )
}

export default App


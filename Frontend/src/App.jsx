import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import HomePage from './pages/home'
import { Toaster } from 'react-hot-toast'
import PasswordPage from './pages/password'
import { Routes, Route } from "react-router-dom";


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Toaster position ='top-center' />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/:shortUrl' element={<PasswordPage />} />
      </Routes>
      
    </div>
  )
}

export default App

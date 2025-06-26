import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import LandingPage from './components/LandingPage'
import CarRecognitionApp from './components/CarRecognitionApp'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<CarRecognitionApp />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
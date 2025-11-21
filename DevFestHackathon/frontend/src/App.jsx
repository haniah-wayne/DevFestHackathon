import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import StudentDashboard from './pages/StudentDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import ProfessorDashboard from './pages/ProfessorDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import ProjectDetail from './pages/ProjectDetail'

export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/professor" element={<ProfessorDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </HashRouter>
  )
}

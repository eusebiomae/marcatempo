import { Routes, Route } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'

import Dashboard from '../pages/Dashboard'
import Tracker from '../pages/Tracker'
import Calendar from '../pages/Calendar'
import Projects from '../pages/Projects'
import Clients from '../pages/Clients'
import Reports from '../pages/Reports'
import Backup from '../pages/Backup'
import Settings from '../pages/Settings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        <Route path="/" element={<Dashboard />} />

        <Route path="/tracker" element={<Tracker />} />

        <Route path="/calendar" element={<Calendar />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/clients" element={<Clients />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/backup" element={<Backup />} />

        <Route path="/settings" element={<Settings />} />

      </Route>
    </Routes>
  )
}
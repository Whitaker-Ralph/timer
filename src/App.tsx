import { Routes, Route } from 'react-router-dom'
import TimerPage from './pages/TimerPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TimerPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  )
}

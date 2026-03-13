import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import StartupDetail from './pages/StartupDetail.jsx'
import SubmitMetrics from './pages/SubmitMetrics.jsx'
import RegisterStartup from './pages/RegisterStartup.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ position: 'relative', zIndex: 1, paddingTop: 80, minHeight: '100vh', boxSizing: 'border-box' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/startup/:id" element={<StartupDetail />} />
          <Route path="/submit" element={<SubmitMetrics />} />
          <Route path="/register" element={<RegisterStartup />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

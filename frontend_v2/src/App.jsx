import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Allowances from './pages/Allowances.jsx'
import Trade from './pages/Trade.jsx'
import GovPanel from './pages/GovPanel.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <div className="layout">
        <Navbar />
        <div className="content">
          <Sidebar />
          <div className="page">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/allowances" element={<PrivateRoute><Allowances /></PrivateRoute>} />
              <Route path="/trade" element={<PrivateRoute><Trade /></PrivateRoute>} />
              <Route path="/gov" element={<PrivateRoute><GovPanel /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}


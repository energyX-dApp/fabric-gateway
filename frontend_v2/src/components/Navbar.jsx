import { useAuth } from '../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { token, orgKey, user, setToken, setOrgKey, setUser } = useAuth()
  const nav = useNavigate()
  const logout = () => { setToken(''); setOrgKey(''); setUser(null); nav('/login') }
  return (
    <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px' }}>
      <Link to="/" style={{ color:'#fff', textDecoration:'none', fontWeight:700 }}>CO₂ Dashboard</Link>
      <div className="muted">{token ? (<>
        <span style={{ marginRight:12 }}>{user?.username || 'User'} · Org: {orgKey}</span>
        <button className="btn" onClick={logout}>Logout</button>
      </>) : (<Link className="btn" to="/login">Login</Link>)}</div>
    </div>
  )
}



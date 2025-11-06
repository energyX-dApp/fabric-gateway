import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { signin, myProfile } from '../services/user'

export default function Login() {
  const nav = useNavigate()
  const { setToken, setOrgKey, setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgKey, setOrg] = useState('Org1')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setError('')
    try {
      const { token } = await signin({ email, unhashedPassword: password })
      // validate org in JWT
      const payload = JSON.parse(atob(token.split('.')[1] || ''))
      if (payload?.orgKey && payload.orgKey !== orgKey) return setError('Selected org does not match your registered org.')
      setToken(token); setOrgKey(orgKey)
      try { const prof = await myProfile(); setUser(prof.userObject || null) } catch {}
      nav('/dashboard')
    } catch (e2) {
      setError('Login failed')
    }
  }

  return (
    <div className="page" style={{ display:'grid', placeItems:'center', minHeight:'80vh' }}>
      <form className="card" onSubmit={submit} style={{ width:360, display:'flex', flexDirection:'column', gap:12 }}>
        <h2>Login</h2>
        <input className="input" placeholder="Email" value={email} onChange={e=> setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=> setPassword(e.target.value)} />
        <select className="input" value={orgKey} onChange={e=> setOrg(e.target.value)}>
          <option>Org1</option><option>Org2</option><option>Gov</option>
        </select>
        {error && <div className="muted" style={{ color:'#ff6b6b' }}>{error}</div>}
        <button className="btn" type="submit">Login</button>
        <div className="muted">No account? <Link to="/signup">Signup</Link></div>
      </form>
    </div>
  )
}



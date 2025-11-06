import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { signup, myProfile } from '../services/user'

export default function Signup() {
  const nav = useNavigate()
  const { setToken, setOrgKey, setUser } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgKey, setOrg] = useState('Org1')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setError('')
    try {
      const { token } = await signup({ username, email, unhashedPassword: password, orgKey })
      setToken(token); setOrgKey(orgKey)
      try { const prof = await myProfile(); setUser(prof.userObject || null) } catch {}
      nav('/dashboard')
    } catch (e2) {
      setError('Signup failed')
    }
  }

  return (
    <div className="page" style={{ display:'grid', placeItems:'center', minHeight:'80vh' }}>
      <form className="card" onSubmit={submit} style={{ width:360, display:'flex', flexDirection:'column', gap:12 }}>
        <h2>Signup</h2>
        <input className="input" placeholder="Username" value={username} onChange={e=> setUsername(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=> setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=> setPassword(e.target.value)} />
        <select className="input" value={orgKey} onChange={e=> setOrg(e.target.value)}>
          <option>Org1</option><option>Org2</option><option>Gov</option>
        </select>
        {error && <div className="muted" style={{ color:'#ff6b6b' }}>{error}</div>}
        <button className="btn" type="submit">Create account</button>
        <div className="muted">Have an account? <Link to="/login">Login</Link></div>
      </form>
    </div>
  )
}



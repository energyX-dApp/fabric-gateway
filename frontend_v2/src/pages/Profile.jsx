import { useEffect, useState } from 'react'
import { myProfile } from '../services/user'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { orgKey } = useAuth()
  const [p, setP] = useState(null)
  useEffect(()=>{ myProfile().then(d=> setP(d.userObject || null)).catch(()=> setP(null)) }, [])
  return (
    <div className="page">
      <div className="card">
        <h2>My Profile</h2>
        {p ? (
          <>
            <div><b>Username:</b> {p.username}</div>
            <div><b>Email:</b> {p.email}</div>
            <div><b>User ID:</b> {p.id}</div>
            <div><b>Org:</b> {orgKey}</div>
            <div><b>Carbon Credits:</b> {p.carbonCreditsBalance}</div>
          </>
        ) : <div>Loading...</div>}
      </div>
    </div>
  )
}



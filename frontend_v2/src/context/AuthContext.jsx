import { createContext, useContext, useMemo, useState, useEffect } from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [orgKey, setOrgKey] = useState(() => localStorage.getItem('orgKey') || '')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token')
    if (orgKey) localStorage.setItem('orgKey', orgKey); else localStorage.removeItem('orgKey')
  }, [token, orgKey])

  const value = useMemo(() => ({ token, setToken, orgKey, setOrgKey, user, setUser }), [token, orgKey, user])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() { return useContext(AuthCtx) }



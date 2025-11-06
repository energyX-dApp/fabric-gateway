import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Sidebar() {
  const { orgKey } = useAuth()
  const link = (to, label) => (
    <NavLink to={to} style={({isActive})=>({ display:'block', padding:'10px 12px', borderRadius:8, textDecoration:'none', color:'#e7e8ea', background:isActive?'#1f2233':'transparent' })}>{label}</NavLink>
  )
  return (
    <div className="card" style={{ width:240, height:'calc(100vh - 92px)', margin:20 }}>
      {link('/dashboard','Dashboard')}
      {link('/allowances','Allowances')}
      {link('/trade','Trade')}
      {orgKey==='Gov' && link('/gov','Gov Panel')}
      {link('/profile','Profile')}
    </div>
  )
}



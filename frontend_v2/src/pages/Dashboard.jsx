import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import CardStat from '../components/CardStat.jsx'
import { ownerBalance, listAllowances } from '../services/allowance'

export default function Dashboard() {
  const { orgKey, user } = useAuth()
  const ownerMsp = `${orgKey}MSP`
  const [balance, setBalance] = useState(0)
  const [allowCount, setAllowCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const b = await ownerBalance(ownerMsp)
        const lst = await listAllowances()
        if (!active) return
        setBalance(Number(b.balanceKg || 0))
        setAllowCount(Array.isArray(lst) ? lst.filter(a=> a.owner===ownerMsp).length : 0)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
  }, [ownerMsp])

  const inr = balance * 25

  return (
    <div className="page">
      <div className="row">
        <CardStat title={`Welcome, ${user?.username || ''}`} value={`Org: ${orgKey}`} />
        <CardStat title="Current Allowance (kg)" value={loading? '...' : balance} sub={`≈ ₹ ${inr.toLocaleString()}`} />
        <CardStat title="Owned Allowances" value={loading? '...' : allowCount} />
      </div>
    </div>
  )
}



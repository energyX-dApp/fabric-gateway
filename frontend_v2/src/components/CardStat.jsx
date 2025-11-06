export default function CardStat({ title, value, sub }) {
  return (
    <div className="card" style={{ minWidth:220 }}>
      <div className="muted" style={{ marginBottom:8 }}>{title}</div>
      <div style={{ fontSize:28, fontWeight:700 }}>{value}</div>
      {sub && <div className="muted" style={{ marginTop:6 }}>{sub}</div>}
    </div>
  )
}



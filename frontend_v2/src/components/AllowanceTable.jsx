export default function AllowanceTable({ items = [], onRead, onTransfer, onConsume }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Owner</th>
          <th>Total</th>
          <th>Remaining</th>
          <th>Status</th>
          <th>Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.owner}</td>
            <td>{a.total}</td>
            <td>{a.remaining}</td>
            <td>{a.status}</td>
            <td>{a.note}</td>
            <td>
              <button className="btn" onClick={() => onRead?.(a.id)}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}



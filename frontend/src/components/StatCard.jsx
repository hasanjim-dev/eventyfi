export default function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="num">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}

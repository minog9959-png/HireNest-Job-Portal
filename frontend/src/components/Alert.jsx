// Beautiful alert: plain <p> ki jagah yehi use hota hai.
// type: "success" (green), "error" (red), "info" (blue)
export default function Alert({ type = 'info', children }) {
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'i';
  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="alert-icon">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

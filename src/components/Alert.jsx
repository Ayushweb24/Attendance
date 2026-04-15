export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styles = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };

  return (
    <div
      className={`flex items-start gap-2 px-4 py-3 rounded-lg border text-sm ${styles[type]}`}
      role="alert"
    >
      <span>{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}

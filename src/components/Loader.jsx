export default function Loader({ size = 'md', fullScreen = false }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const spinner = (
    <div
      className={`animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 ${sizes[size]}`}
      role="status"
      aria-label="Loading"
    />
  );
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
        {spinner}
      </div>
    );
  }
  return <div className="flex justify-center py-8">{spinner}</div>;
}

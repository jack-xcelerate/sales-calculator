export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 bg-transparent border border-orange-600/50 hover:border-orange-600 rounded-lg text-white ${className}`}
      {...props}
    />
  );
}

export function Label({ className = '', children, ...props }) {
  return (
    <label className={`text-sm text-white/90 ${className}`} {...props}>
      {children}
    </label>
  );
}

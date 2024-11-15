export function Tooltip({ content, children }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible absolute z-50 w-48 p-2 text-sm bg-gray-900 text-white rounded-md shadow-lg -top-2 left-full ml-2">
        {content}
      </div>
    </div>
  );
}

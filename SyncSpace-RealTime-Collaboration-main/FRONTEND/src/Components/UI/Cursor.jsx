import 'react';

export default function Cursor({ name, color, top, left }) {
  // Helper to map tailwind bg colors to hex for the SVG stroke/fill
  const getHexColor = (colorClass) => {
    if (colorClass.includes('indigo')) return '#6366f1';
    if (colorClass.includes('orange')) return '#f97316';
    if (colorClass.includes('blue')) return '#3b82f6';
    if (colorClass.includes('green')) return '#22c55e';
    return '#000000';
  };

  return (
    <div className="absolute pointer-events-none" style={{ top, left, zIndex: 50 }}>
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
        <path d="M1 1L6.75 18.25L9.625 11.5L14.5 14L15.5 12L10.5 9.5L14 3L1 1Z" fill={getHexColor(color)} stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      <div className={`${color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm ml-2 mt-1 whitespace-nowrap`}>
        {name}
      </div>
    </div>
  );
}
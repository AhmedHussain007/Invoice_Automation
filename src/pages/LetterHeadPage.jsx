import React, { useState, useEffect } from 'react';

// Design coordinate space (A4 at 96dpi)
const DESIGN_CANVAS = { W: 794, H: 1123 };

// Template image size (matches the actual PNG dimensions)
const CANVAS = { W: 1149, H: 1369 };

const SCALE = {
  x: CANVAS.W / DESIGN_CANVAS.W,
  y: CANVAS.H / DESIGN_CANVAS.H,
};

// Absolute pixel positions for text overlays on the 794x1123 canvas
const OVERLAYS = {
  phone:      { x: 605, y: 24,   w: 175, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  email:      { x: 605, y: 66,   w: 175, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  website:    { x: 605, y: 108,  w: 175, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  location:   { x: 605, y: 150,  w: 175, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  footerName: { x: 265, y: 1066, w: 140, fontSize: 13, fontWeight: 900, color: '#0a1f44', align: 'left', uppercase: true },
  footerNTN:  { x: 425, y: 1066, w: 120, fontSize: 13, fontWeight: 700, color: '#1f2937', align: 'left' },
};

const InputGroup = ({ label, field, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange?.(field, e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-left focus:border-[#0a1f44] focus:outline-none focus:ring-1 focus:ring-[#0a1f44]"
    />
  </div>
);

const AbsText = ({ config, value, devMode }) => {
  if (!value) return null;
  const scaledX = Math.round(config.x * SCALE.x);
  const scaledY = Math.round(config.y * SCALE.y);
  const scaledW = Math.round(config.w * SCALE.x);
  const scaledFontSize = Math.round(config.fontSize * SCALE.y);
  return (
    <div
      style={{
        position: 'absolute',
        left: `${scaledX}px`,
        top: `${scaledY}px`,
        width: `${scaledW}px`,
        fontSize: `${scaledFontSize}px`,
        fontWeight: config.fontWeight,
        color: config.color,
        textAlign: config.align || 'left',
        textTransform: config.uppercase ? 'uppercase' : 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        border: devMode ? '1px dashed red' : 'none',
        backgroundColor: devMode ? 'rgba(255,0,0,0.1)' : 'transparent',
        lineHeight: 1.2
      }}
    >
      {value}
    </div>
  );
};

export default function LetterHeadPage() {
  const [data, setData] = useState({
    phone: '',
    email: '',
    website: '',
    location: '',
    footerName: '',
    footerNTN: '',
  });

  const [devMode, setDevMode] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('letterhead_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse letterhead_data', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('letterhead_data', JSON.stringify(data));
  }, [data]);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Panel - Form */}
      <div className="w-[400px] border-r border-gray-200 bg-white overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-[#0a1f44]">Letterhead Editor</h2>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
            <input 
              type="checkbox" 
              checked={devMode} 
              onChange={(e) => setDevMode(e.target.checked)} 
              className="rounded text-[#0a1f44]"
            />
            Dev Mode
          </label>
        </div>
        
        <div className="p-6 flex-1">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4">Header Information</h3>
            <InputGroup label="Phone" field="phone" value={data.phone} onChange={handleChange} />
            <InputGroup label="Email" field="email" value={data.email} onChange={handleChange} />
            <InputGroup label="Website Address" field="website" value={data.website} onChange={handleChange} />
            <InputGroup label="Location" field="location" value={data.location} onChange={handleChange} />
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4">Footer Information</h3>
            <InputGroup label="Name" field="footerName" value={data.footerName} onChange={handleChange} />
            <InputGroup label="NTN" field="footerNTN" value={data.footerNTN} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* Right Panel - Sticky Preview */}
      <div className="flex-1 bg-gray-200 overflow-auto p-8 flex justify-center items-start">
        <div 
          className="bg-white shadow-2xl relative"
          style={{ 
            width: `${CANVAS.W}px`, 
            height: `${CANVAS.H}px`,
            backgroundImage: 'url("/templates/letterhead.png")',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <AbsText config={OVERLAYS.phone} value={data.phone} />
          <AbsText config={OVERLAYS.email} value={data.email} />
          <AbsText config={OVERLAYS.website} value={data.website} />
          <AbsText config={OVERLAYS.location} value={data.location} />
          <AbsText config={OVERLAYS.footerName} value={data.footerName} />
          <AbsText config={OVERLAYS.footerNTN} value={data.footerNTN} />
        </div>
      </div>
    </div>
  );
}

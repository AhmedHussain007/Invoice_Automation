import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PROFILE_KEY = 'invoice_profile';

// Design coordinate space (A4 at 96dpi)
const DESIGN_CANVAS = { W: 794, H: 1123 };

// Template image size (matches the actual PNG dimensions)
const CANVAS = { W: 1149, H: 1369 };

const SCALE = {
  x: CANVAS.W / DESIGN_CANVAS.W,
  y: CANVAS.H / DESIGN_CANVAS.H,
};

const DEFAULT_PROFILE = {
  phone: '',
  email: '',
  website: '',
  location: '',
  accountNumber: '',
  accountTitle: '',
  bankName: '',
  iban: '',
  swift: '',
  paymentMethod: '',
  footerName: '',
  footerNTN: '',
};

const DEFAULT_INVOICE = {
  clientName: '',
  companyName: '',
  address: '',
  clientEmail: '',
  clientPhone: '',
  companyNumber: '',
  vat: '',
  invoiceNo: '',
  invoiceDate: '',
  dueDate: '',
  currency: '',
  paymentTerms: '',
};

// Absolute pixel positions for text overlays on the design canvas (794x1123)
const OVERLAYS = {
  headerPhone:        { x: 580, y: 40,  w: 180, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  headerEmail:        { x: 580, y: 75,  w: 180, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  headerWebsite:      { x: 580, y: 110, w: 180, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  headerLocation:     { x: 580, y: 145, w: 180, fontSize: 13, fontWeight: 500, color: '#1f2937' },

//   billClientName:     { x: 120, y: 287, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },
//   billCompanyName:    { x: 139, y: 308, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },
//   billAddress:        { x: 98, y: 329, w: 260, fontSize: 13, fontWeight: 500, color: '#1f2937' },
//   billEmail:          { x: 85, y: 349, w: 260, fontSize: 13, fontWeight: 500, color: '#1f2937' },
//   billPhone:          { x: 85, y: 368, w: 260, fontSize: 13, fontWeight: 500, color: '#1f2937' },
//   billCompanyNumber:  { x: 150, y: 388, w: 260, fontSize: 13, fontWeight: 500, color: '#1f2937' },
//   billVat:            { x: 75, y: 409, w: 260, fontSize: 13, fontWeight: 500, color: '#1f2937' },

  billClientName:     { x: 160, y: 287, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  billCompanyName:    { x: 160, y: 308, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  billAddress:        { x: 160, y: 329, w: 320, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  billEmail:          { x: 160, y: 349, w: 260, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  billPhone:          { x: 160, y: 368, w: 260, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  billCompanyNumber:  { x: 160, y: 388, w: 260, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  billVat:            { x: 160, y: 409, w: 260, fontSize: 13, fontWeight: 500, color: '#1f2937' },

  invoiceNo:          { x: 620, y: 303, w: 170, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  invoiceDate:        { x: 620, y: 328, w: 170, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  dueDate:            { x: 620, y: 353, w: 170, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  currency:           { x: 620, y: 378, w: 170, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  paymentTerms:       { x: 620, y: 401, w: 170, fontSize: 13, fontWeight: 500, color: '#1f2937' },

  paymentAccountNo:   { x: 160, y: 795, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  paymentAccountTitle:{ x: 160, y: 813, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  paymentBankName:    { x: 160, y: 830, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  paymentIban:        { x: 160, y: 848, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  paymentSwift:       { x: 160, y: 864, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  paymentMethod:      { x: 160, y: 882, w: 250, fontSize: 13, fontWeight: 500, color: '#1f2937' },

  footerName:         { x: 210, y: 1060, w: 150, fontSize: 13, fontWeight: 900, color: '#0a1f44', align: 'center', uppercase: true },
  footerNTN:          { x: 405, y: 1060, w: 110, fontSize: 13, fontWeight: 700, color: '#1f2937', align: 'center' },
};

const InputGroup = ({ label, field, value, onChange, type = 'text', placeholder }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(field, e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-left focus:border-[#0a1f44] focus:outline-none focus:ring-1 focus:ring-[#0a1f44]"
    />
  </div>
);

const ReadOnlyRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-1">
    <span className="text-xs font-semibold text-gray-500">{label}</span>
    <span className="text-xs text-gray-800 text-right break-all">{value || '—'}</span>
  </div>
);

const AbsText = ({ config, value, devMode }) => {
  if (!value) return null;

  const scaledX = Math.round(config.x * SCALE.x);
  const scaledY = Math.round(config.y * SCALE.y);
  const scaledW = Math.round(config.w * SCALE.x);
  const scaledFontSize = Math.round(config.fontSize * SCALE.y);

  const textBoxHeight = Math.ceil(scaledFontSize * 1.5);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${scaledX}px`,
        top: `${scaledY-2}px`,
        width: `${scaledW}px`,
        height: `${textBoxHeight}px`,
        fontSize: `${scaledFontSize}px`,
        fontWeight: config.fontWeight,
        color: config.color,
        textAlign: config.align || 'left',
        textTransform: config.uppercase ? 'uppercase' : 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: `${scaledFontSize}px`,
        fontFamily: 'Arial, Helvetica, sans-serif',
        transform: 'translateY(-2px)',
        border: devMode ? '1px dashed red' : 'none',
        backgroundColor: devMode ? 'rgba(255,0,0,0.08)' : 'transparent',
        zIndex: 2,
      }}
    >
      {value}
    </div>
  );
};

export default function GenerateInvoicePage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [invoice, setInvoice] = useState(DEFAULT_INVOICE);
  const [devMode, setDevMode] = useState(false);
  const [fitPreview, setFitPreview] = useState(true);
  const [previewScale, setPreviewScale] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewWrapRef = useRef(null);
  const captureRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse invoice_profile', error);
      }
    }
  }, []);

  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return undefined;

    const updateScale = () => {
      const width = el.clientWidth;
      if (!width) return;
      const nextScale = Math.min(1, width / CANVAS.W);
      setPreviewScale(nextScale);
    };

    updateScale();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleChange = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownloadPdf = async () => {
    if (!captureRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        letterRendering: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [CANVAS.W, CANVAS.H],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, CANVAS.W, CANVAS.H);
      pdf.save('invoice.pdf');
    } catch (error) {
      console.error('Failed to download PDF', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const effectiveScale = fitPreview ? previewScale : 1;
  const scaledWidth = Math.round(CANVAS.W * effectiveScale);
  const scaledHeight = Math.round(CANVAS.H * effectiveScale);

  const PreviewCanvas = ({ scale, innerRef, showDevMode, withShadow = true }) => {
    const scaledW = Math.round(CANVAS.W * scale);
    const scaledH = Math.round(CANVAS.H * scale);

    return (
      <div style={{ width: `${scaledW}px`, height: `${scaledH}px` }}>
        <div
          ref={innerRef}
          className={`bg-white relative ${withShadow ? 'shadow-2xl' : ''}`}
          style={{
            width: `${CANVAS.W}px`,
            height: `${CANVAS.H}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundImage: 'url("/Invoice_template.png")',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Header contact from profile */}
          <AbsText config={OVERLAYS.headerPhone} value={profile.phone} devMode={showDevMode} />
          <AbsText config={OVERLAYS.headerEmail} value={profile.email} devMode={showDevMode} />
          <AbsText config={OVERLAYS.headerWebsite} value={profile.website} devMode={showDevMode} />
          <AbsText config={OVERLAYS.headerLocation} value={profile.location} devMode={showDevMode} />

          {/* Bill To values */}
          <AbsText config={OVERLAYS.billClientName} value={invoice.clientName} devMode={showDevMode} />
          <AbsText config={OVERLAYS.billCompanyName} value={invoice.companyName} devMode={showDevMode} />
          <AbsText config={OVERLAYS.billAddress} value={invoice.address} devMode={showDevMode} />
          <AbsText config={OVERLAYS.billEmail} value={invoice.clientEmail} devMode={showDevMode} />
          <AbsText config={OVERLAYS.billPhone} value={invoice.clientPhone} devMode={showDevMode} />
          <AbsText config={OVERLAYS.billCompanyNumber} value={invoice.companyNumber} devMode={showDevMode} />
          <AbsText config={OVERLAYS.billVat} value={invoice.vat} devMode={showDevMode} />

          {/* Invoice info values */}
          <AbsText config={OVERLAYS.invoiceNo} value={invoice.invoiceNo} devMode={showDevMode} />
          <AbsText config={OVERLAYS.invoiceDate} value={invoice.invoiceDate} devMode={showDevMode} />
          <AbsText config={OVERLAYS.dueDate} value={invoice.dueDate} devMode={showDevMode} />
          <AbsText config={OVERLAYS.currency} value={invoice.currency} devMode={showDevMode} />
          <AbsText config={OVERLAYS.paymentTerms} value={invoice.paymentTerms} devMode={showDevMode} />

          {/* Payment details from profile */}
          <AbsText config={OVERLAYS.paymentAccountNo} value={profile.accountNumber} devMode={showDevMode} />
          <AbsText config={OVERLAYS.paymentAccountTitle} value={profile.accountTitle} devMode={showDevMode} />
          <AbsText config={OVERLAYS.paymentBankName} value={profile.bankName} devMode={showDevMode} />
          <AbsText config={OVERLAYS.paymentIban} value={profile.iban} devMode={showDevMode} />
          <AbsText config={OVERLAYS.paymentSwift} value={profile.swift} devMode={showDevMode} />
          <AbsText config={OVERLAYS.paymentMethod} value={profile.paymentMethod} devMode={showDevMode} />

          {/* Footer values */}
          <AbsText config={OVERLAYS.footerName} value={profile.footerName} devMode={showDevMode} />
          <AbsText config={OVERLAYS.footerNTN} value={profile.footerNTN} devMode={showDevMode} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Panel - Form */}
      <div className="w-[420px] border-r border-gray-200 bg-white overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-[#0a1f44]">Generate Invoice</h2>
            <p className="text-xs text-gray-500">Header + payment details come from Edit Invoice</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={devMode}
                onChange={(e) => setDevMode(e.target.checked)}
                className="rounded text-[#0a1f44]"
              />
              Dev Mode
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={fitPreview}
                onChange={(e) => setFitPreview(e.target.checked)}
                className="rounded text-[#0a1f44]"
              />
              Fit Preview
            </label>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                isDownloading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0a1f44] text-white hover:bg-[#081a38]'
              }`}
            >
              {isDownloading ? 'Preparing...' : 'Download PDF'}
            </button>
          </div>
        </div>

        <div className="p-6 flex-1">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4">Profile (Read Only)</h3>
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <ReadOnlyRow label="Phone" value={profile.phone} />
              <ReadOnlyRow label="Email" value={profile.email} />
              <ReadOnlyRow label="Website" value={profile.website} />
              <ReadOnlyRow label="Location" value={profile.location} />
              <div className="border-t border-gray-200 my-2" />
              <ReadOnlyRow label="Account Number" value={profile.accountNumber} />
              <ReadOnlyRow label="Account Title" value={profile.accountTitle} />
              <ReadOnlyRow label="Bank Name" value={profile.bankName} />
              <ReadOnlyRow label="IBAN / Account No" value={profile.iban} />
              <ReadOnlyRow label="SWIFT Code" value={profile.swift} />
              <ReadOnlyRow label="Payment Method" value={profile.paymentMethod} />
              <div className="border-t border-gray-200 my-2" />
              <ReadOnlyRow label="Name" value={profile.footerName} />
              <ReadOnlyRow label="NTN" value={profile.footerNTN} />
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              To update these, go to Edit Invoice.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4">Bill To</h3>
            <InputGroup label="Client Name" field="clientName" value={invoice.clientName} onChange={handleChange} />
            <InputGroup label="Company Name" field="companyName" value={invoice.companyName} onChange={handleChange} />
            <InputGroup label="Address" field="address" value={invoice.address} onChange={handleChange} />
            <InputGroup label="Email" field="clientEmail" value={invoice.clientEmail} onChange={handleChange} type="email" />
            <InputGroup label="Phone" field="clientPhone" value={invoice.clientPhone} onChange={handleChange} />
            <InputGroup label="Company Number" field="companyNumber" value={invoice.companyNumber} onChange={handleChange} />
            <InputGroup label="VAT" field="vat" value={invoice.vat} onChange={handleChange} />
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4">Invoice Details</h3>
            <InputGroup label="Invoice Number" field="invoiceNo" value={invoice.invoiceNo} onChange={handleChange} />
            <InputGroup label="Invoice Date" field="invoiceDate" value={invoice.invoiceDate} onChange={handleChange} type="date" />
            <InputGroup label="Due Date" field="dueDate" value={invoice.dueDate} onChange={handleChange} type="date" />
            <InputGroup label="Currency" field="currency" value={invoice.currency} onChange={handleChange} />
            <InputGroup label="Payment Terms" field="paymentTerms" value={invoice.paymentTerms} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 bg-gray-200 overflow-auto p-8 flex justify-center items-start">
        <div ref={previewWrapRef} className="w-full flex justify-center items-start">
          <div style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}>
            <PreviewCanvas scale={effectiveScale} showDevMode={devMode} />
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: `${CANVAS.W}px`,
          height: `${CANVAS.H}px`,
          pointerEvents: 'none',
        }}
      >
        <PreviewCanvas scale={1} innerRef={captureRef} showDevMode={false} withShadow={false} />
      </div>
    </div>
  );
}

import React, { forwardRef } from 'react';

const PreviewPanel = forwardRef(({ data, devMode }, ref) => {
  const subtotal = data.services.reduce((acc, curr) => acc + ((curr.qty || 0) * (curr.rate || 0)), 0);
  const total = subtotal - Number(data.discount || 0);

  // Helper for absolute positioning elements
  const AbsBox = ({ x, y, w, h, align = 'left', size = '14px', weight = 'normal', color = '#1f2937', children }) => (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: w ? `${w}px` : 'auto',
        height: h ? `${h}px` : 'auto',
        textAlign: align,
        fontSize: size,
        fontWeight: weight,
        color: color,
        border: devMode ? '1px solid rgba(255, 0, 0, 0.5)' : 'none',
        backgroundColor: devMode ? 'rgba(255, 0, 0, 0.05)' : 'transparent',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        lineHeight: 1.2
      }}
    >
      {children}
    </div>
  );

  return (
    <div 
      ref={ref} 
      className="bg-white mx-auto relative shadow-2xl font-sans"
      style={{ 
        width: '794px', 
        height: '1123px', 
        backgroundImage: 'url("/blank_template.png")',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* --- Bill To Section --- */}
      <AbsBox x={45} y={260} w={300} h={20} size="16px" weight="bold">{data.clientName}</AbsBox>
      <AbsBox x={45} y={285} w={300} h={18}>{data.addressLine1}</AbsBox>
      <AbsBox x={45} y={305} w={300} h={18}>{data.cityStateCountry}</AbsBox>
      {data.email && <AbsBox x={45} y={325} w={300} h={18}>Email: {data.email}</AbsBox>}
      {data.phone && <AbsBox x={45} y={345} w={300} h={18}>Phone: {data.phone}</AbsBox>}

      {/* --- Invoice Info Section (Values Only) --- */}
      <AbsBox x={640} y={265} w={110} align="right" weight="bold">{data.invoiceNo}</AbsBox>
      <AbsBox x={640} y={290} w={110} align="right">{data.invoiceDate}</AbsBox>
      <AbsBox x={640} y={315} w={110} align="right">{data.dueDate}</AbsBox>
      <AbsBox x={640} y={340} w={110} align="right">{data.currency}</AbsBox>
      <AbsBox x={640} y={365} w={110} align="right">{data.paymentTerms}</AbsBox>

      {/* --- Services Table --- */}
      {data.services && data.services.map((svc, idx) => {
        const rowY = 460 + (idx * 60); // 60px height per row
        return (
          <React.Fragment key={svc.id}>
            <AbsBox x={45} y={rowY} w={40} align="center" weight="bold">{idx + 1}</AbsBox>
            
            {/* Description is two lines */}
            <AbsBox x={105} y={rowY - 5} w={330} size="15px" weight="bold" color="#0a1f44">{svc.title}</AbsBox>
            <AbsBox x={105} y={rowY + 15} w={330} size="13px" color="#4b5563">{svc.desc}</AbsBox>

            <AbsBox x={450} y={rowY} w={80} align="center">{svc.qty}</AbsBox>
            <AbsBox x={540} y={rowY} w={80} align="center">{Number(svc.rate || 0).toFixed(2)}</AbsBox>
            <AbsBox x={640} y={rowY} w={110} align="right">{((svc.qty || 0) * (svc.rate || 0)).toFixed(2)}</AbsBox>
          </React.Fragment>
        );
      })}

      {/* --- Totals Box --- */}
      <AbsBox x={640} y={710} w={110} align="right" weight="bold">{subtotal.toFixed(2)}</AbsBox>
      <AbsBox x={640} y={745} w={110} align="right" weight="bold">{Number(data.discount) === 0 ? '—' : Number(data.discount).toFixed(2)}</AbsBox>
      <AbsBox x={640} y={785} w={110} align="right" weight="bold" color="#ffffff" size="16px">{total.toFixed(2)}</AbsBox>

      {/* --- Payment Details --- */}
      <AbsBox x={180} y={755} w={200}>{data.accountName}</AbsBox>
      <AbsBox x={180} y={777} w={200}>{data.accountTitle}</AbsBox>
      <AbsBox x={180} y={799} w={200}>{data.bankName}</AbsBox>
      <AbsBox x={180} y={821} w={200}>{data.iban}</AbsBox>
      <AbsBox x={180} y={843} w={200}>{data.swift}</AbsBox>
      <AbsBox x={180} y={865} w={200}>{data.paymentMethod}</AbsBox>

      {/* --- Signature --- */}
      <AbsBox x={560} y={880} w={180} align="center" weight="bold">{data.soleProprietorName}</AbsBox>

      {/* --- Footer --- */}
      <AbsBox x={240} y={1050} w={150} align="center" weight="900" size="13px">{data.soleProprietorName}</AbsBox>
      <AbsBox x={440} y={1050} w={100} align="center" weight="900" size="13px">{data.ntn}</AbsBox>
      <AbsBox x={580} y={1050} w={180} align="center" weight="900" size="13px">{data.businessName}</AbsBox>

    </div>
  );
});

PreviewPanel.displayName = 'PreviewPanel';
export default PreviewPanel;

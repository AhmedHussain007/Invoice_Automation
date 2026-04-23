import { useState } from 'react';

const InputGroup = ({ label, field, type = 'text', data, handleChange }) => (
  <div className="mb-3">
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={data[field] || ''}
      onChange={(e) => handleChange(field, e.target.value)}
      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:border-brand-dark focus:outline-none"
    />
  </div>
);

export default function FormPanel({ data, setData }) {
  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => 
        s.id === id ? { ...s, [field]: (field === 'qty' || field === 'rate') && value !== '' ? Number(value) : value } : s
      )
    }));
  };

  const addService = () => {
    const newId = data.services.length > 0 ? Math.max(...data.services.map(s => s.id)) + 1 : 1;
    setData((prev) => ({
      ...prev,
      services: [...prev.services, { id: newId, title: '', desc: '', qty: 1, rate: 0 }]
    }));
  };

  const removeService = (id) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };


  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Invoice Details</h2>
      
      {/* Client Info */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-2">Client Information</h3>
        <InputGroup label="Client / Company Name" field="clientName" data={data} handleChange={handleChange} />
        <InputGroup label="Address Line 1" field="addressLine1" data={data} handleChange={handleChange} />
        <InputGroup label="City, State / Country" field="cityStateCountry" data={data} handleChange={handleChange} />
        <InputGroup label="Email" field="email" data={data} handleChange={handleChange} />
        <InputGroup label="Phone" field="phone" data={data} handleChange={handleChange} />
      </div>

      {/* Invoice Info */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-2">Invoice Information</h3>
        <InputGroup label="Invoice No." field="invoiceNo" data={data} handleChange={handleChange} />
        <InputGroup label="Invoice Date" field="invoiceDate" data={data} handleChange={handleChange} />
        <InputGroup label="Due Date" field="dueDate" data={data} handleChange={handleChange} />
        <InputGroup label="Currency" field="currency" data={data} handleChange={handleChange} />
        <InputGroup label="Payment Terms" field="paymentTerms" data={data} handleChange={handleChange} />
      </div>

      {/* Services Table */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
          Services
          <button onClick={addService} className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded">Add Row</button>
        </h3>
        {data.services.map((svc, index) => (
          <div key={svc.id} className="border p-3 rounded mb-3 bg-gray-50 relative">
            <button 
              onClick={() => removeService(svc.id)}
              className="absolute top-2 right-2 text-red-500 text-xs hover:underline"
            >
              Remove
            </button>
            <div className="mb-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
              <input
                type="text"
                value={svc.title || ''}
                onChange={(e) => handleServiceChange(svc.id, 'title', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <textarea
                value={svc.desc || ''}
                onChange={(e) => handleServiceChange(svc.id, 'desc', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                rows="2"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">QTY</label>
                <input
                  type="number"
                  value={svc.qty === 0 && svc.qty !== '' ? 0 : (svc.qty || '')}
                  onChange={(e) => handleServiceChange(svc.id, 'qty', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Rate</label>
                <input
                  type="number"
                  value={svc.rate === 0 && svc.rate !== '' ? 0 : (svc.rate || '')}
                  onChange={(e) => handleServiceChange(svc.id, 'rate', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-2">Totals & Discount</h3>
        <InputGroup label="Discount" field="discount" type="number" data={data} handleChange={handleChange} />
      </div>

      {/* Payment Details */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-2">Payment Details</h3>
        <InputGroup label="Account Name" field="accountName" data={data} handleChange={handleChange} />
        <InputGroup label="Account Title" field="accountTitle" data={data} handleChange={handleChange} />
        <InputGroup label="Bank Name" field="bankName" data={data} handleChange={handleChange} />
        <InputGroup label="IBAN / Account No" field="iban" data={data} handleChange={handleChange} />
        <InputGroup label="SWIFT Code" field="swift" data={data} handleChange={handleChange} />
        <InputGroup label="Payment Method" field="paymentMethod" data={data} handleChange={handleChange} />
      </div>

      {/* Footer Info */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-2">Footer Info</h3>
        <InputGroup label="Sole Proprietor Name" field="soleProprietorName" data={data} handleChange={handleChange} />
        <InputGroup label="NTN" field="ntn" data={data} handleChange={handleChange} />
        <InputGroup label="Business Name" field="businessName" data={data} handleChange={handleChange} />
      </div>
      
    </div>
  );
}

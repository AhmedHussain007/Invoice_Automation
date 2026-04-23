// Canvas size (A4 at 96dpi)
export const CANVAS = { W: 794, H: 1123 };

// Absolute pixel positions for text overlays on the 794x1123 canvas
export const OVERLAYS = {
  companyName:       { x: 202, y: 18,   w: 320, fontSize: 44, fontWeight: 900, color: '#0a1f44', letterSpacing: '0.08em' },
  digitalSolutions:  { x: 202, y: 76,   w: 320, fontSize: 20, fontWeight: 700, color: '#0a1f44', letterSpacing: '0.22em' },
  tagline:           { x: 152, y: 126,  w: 370, fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '0.15em', align: 'center' },
  phone:             { x: 605, y: 24,   w: 175, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  email:             { x: 605, y: 66,   w: 175, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  website:           { x: 605, y: 108,  w: 175, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  location:          { x: 605, y: 150,  w: 175, fontSize: 13, fontWeight: 500, color: '#1f2937' },
  footerName:        { x: 265, y: 1066, w: 140, fontSize: 13, fontWeight: 900, color: '#0a1f44', align: 'center', uppercase: true },
  footerNTN:         { x: 425, y: 1066, w: 120, fontSize: 13, fontWeight: 700, color: '#1f2937', align: 'center' },
};

// Logo overlay position (covers the template's default logo)
export const LOGO_OVERLAY = { x: 24, y: 14, w: 138, h: 138 };

// Field definitions for the form
export const FIELDS = [
  { key: 'companyName',      label: 'Company Name',      section: 'header', max: 18,  placeholder: 'RANKIFY' },
  { key: 'digitalSolutions', label: 'Sub-heading',        section: 'header', max: 28,  placeholder: 'DIGITAL SOLUTIONS' },
  { key: 'tagline',          label: 'Tagline',            section: 'header', max: 52,  placeholder: 'GROW YOUR BRAND. RANK HIGHER. SUCCEED ONLINE.' },
  { key: 'phone',            label: 'Phone',              section: 'header', max: 22,  placeholder: '+92 300 1234567' },
  { key: 'email',            label: 'Email',              section: 'header', max: 36,  placeholder: 'hello@rankifydigital.com' },
  { key: 'website',          label: 'Website',            section: 'header', max: 36,  placeholder: 'www.rankifydigital.com' },
  { key: 'location',         label: 'Location',           section: 'header', max: 26,  placeholder: 'Pakistan' },
  { key: 'footerName',       label: 'Sole Proprietor Name', section: 'footer', max: 22, placeholder: 'YOUR FULL NAME' },
  { key: 'footerNTN',        label: 'NTN Number',         section: 'footer', max: 15,  placeholder: '1234567-8' },
];

export const DEFAULT_VALUES = {
  companyName:      'RANKIFY',
  digitalSolutions: 'DIGITAL SOLUTIONS',
  tagline:          'GROW YOUR BRAND. RANK HIGHER. SUCCEED ONLINE.',
  phone:            '+92 300 1234567',
  email:            'hello@rankifydigital.com',
  website:          'www.rankifydigital.com',
  location:         'Pakistan',
  footerName:       '',
  footerNTN:        '',
};

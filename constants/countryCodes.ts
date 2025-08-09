export type CountryCode = {
  iso2: string; // e.g., 'IN'
  name: string; // e.g., 'India'
  dial_code: string; // e.g., '+91'
};

export const countries: CountryCode[] = [
  { iso2: 'IN', name: 'India', dial_code: '+91' },
  { iso2: 'US', name: 'United States', dial_code: '+1' },
  { iso2: 'CA', name: 'Canada', dial_code: '+1' },
  { iso2: 'GB', name: 'United Kingdom', dial_code: '+44' },
  { iso2: 'AU', name: 'Australia', dial_code: '+61' },
  { iso2: 'NZ', name: 'New Zealand', dial_code: '+64' },
  { iso2: 'SG', name: 'Singapore', dial_code: '+65' },
  { iso2: 'AE', name: 'United Arab Emirates', dial_code: '+971' },
  { iso2: 'SA', name: 'Saudi Arabia', dial_code: '+966' },
  { iso2: 'QA', name: 'Qatar', dial_code: '+974' },
  { iso2: 'KW', name: 'Kuwait', dial_code: '+965' },
  { iso2: 'OM', name: 'Oman', dial_code: '+968' },
  { iso2: 'PK', name: 'Pakistan', dial_code: '+92' },
  { iso2: 'BD', name: 'Bangladesh', dial_code: '+880' },
  { iso2: 'LK', name: 'Sri Lanka', dial_code: '+94' },
  { iso2: 'NP', name: 'Nepal', dial_code: '+977' },
  { iso2: 'DE', name: 'Germany', dial_code: '+49' },
  { iso2: 'FR', name: 'France', dial_code: '+33' },
  { iso2: 'IT', name: 'Italy', dial_code: '+39' },
  { iso2: 'ES', name: 'Spain', dial_code: '+34' },
  { iso2: 'PT', name: 'Portugal', dial_code: '+351' },
  { iso2: 'NL', name: 'Netherlands', dial_code: '+31' },
  { iso2: 'BE', name: 'Belgium', dial_code: '+32' },
  { iso2: 'CH', name: 'Switzerland', dial_code: '+41' },
  { iso2: 'SE', name: 'Sweden', dial_code: '+46' },
  { iso2: 'NO', name: 'Norway', dial_code: '+47' },
  { iso2: 'DK', name: 'Denmark', dial_code: '+45' },
  { iso2: 'FI', name: 'Finland', dial_code: '+358' },
  { iso2: 'IE', name: 'Ireland', dial_code: '+353' },
  { iso2: 'PL', name: 'Poland', dial_code: '+48' },
  { iso2: 'GR', name: 'Greece', dial_code: '+30' },
  { iso2: 'TR', name: 'Turkey', dial_code: '+90' },
  { iso2: 'RU', name: 'Russia', dial_code: '+7' },
  { iso2: 'JP', name: 'Japan', dial_code: '+81' },
  { iso2: 'KR', name: 'South Korea', dial_code: '+82' },
  { iso2: 'CN', name: 'China', dial_code: '+86' },
  { iso2: 'HK', name: 'Hong Kong', dial_code: '+852' },
  { iso2: 'TW', name: 'Taiwan', dial_code: '+886' },
  { iso2: 'TH', name: 'Thailand', dial_code: '+66' },
  { iso2: 'MY', name: 'Malaysia', dial_code: '+60' },
  { iso2: 'ID', name: 'Indonesia', dial_code: '+62' },
  { iso2: 'VN', name: 'Vietnam', dial_code: '+84' },
  { iso2: 'PH', name: 'Philippines', dial_code: '+63' },
  { iso2: 'BR', name: 'Brazil', dial_code: '+55' },
  { iso2: 'MX', name: 'Mexico', dial_code: '+52' },
  { iso2: 'AR', name: 'Argentina', dial_code: '+54' },
  { iso2: 'CL', name: 'Chile', dial_code: '+56' },
  { iso2: 'CO', name: 'Colombia', dial_code: '+57' },
  { iso2: 'PE', name: 'Peru', dial_code: '+51' },
  { iso2: 'ZA', name: 'South Africa', dial_code: '+27' },
  { iso2: 'EG', name: 'Egypt', dial_code: '+20' },
  { iso2: 'KE', name: 'Kenya', dial_code: '+254' },
  { iso2: 'NG', name: 'Nigeria', dial_code: '+234' },
  { iso2: 'IL', name: 'Israel', dial_code: '+972' },
  { iso2: 'IR', name: 'Iran', dial_code: '+98' },
  { iso2: 'IQ', name: 'Iraq', dial_code: '+964' },
];

// helper to render emoji flag from ISO-2 code
export const iso2ToFlagEmoji = (iso2: string): string => {
  if (!iso2 || iso2.length !== 2) return '🏳️';
  const codePoints = iso2
    .toUpperCase()
    .split('')
    .map((char) => 0x1f1e6 + char.charCodeAt(0) - 'A'.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

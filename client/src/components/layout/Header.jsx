import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className='bg-surface-container/80 backdrop-blur-xl docked full-width top-0 h-[64px] border-b border-outline-variant/30 shadow-[0_0_20px_rgba(99,102,241,0.1)] fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-desktop'>
      <div className='flex items-center gap-md'>
        <div className='flex items-center gap-sm'>
          <img
            alt='CalcAPI Logo'
            className='w-6 h-6 object-contain'
            src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD0UlEQVR4AexZvU8UURCf2dNOOQqNRm2NH6HyI0S0UYNaWCGhguQ+uKXR2BsjoPEfEAu5CwcRbQyEWJgoSqyMldopWtGgxGhyi9gQbp8z4HLv7nbf7b7HHTGy2eHmzcz7/d7v7TK527XgHz/+DwHpjNOTtguTqYwzn7YdUU9b4yhMJvuc7jA3h/IKJBJLe1OZwgwgPATADkTYB3U+1jiwwxIwThs33du7tEdFqRQQ216cQMRzKoC65hDahbXyWMURKCBtL/bSzp9WTW5MDs+nMouJIK5AAQDiijxJCDFRBDwyko1jPY05mEvmRhQd8lj2VQJOyYXCivWPZZtm5Vg9fOZgLhlbCDguj2VfIQDjcuHo8M6P8jhp/z6Wtp2rKdsZMDHGSBKWjF3JhYrmoRAgQ5b7KXvxrgUr7yg6hAD9JsYYjJXOOHfIj3xGFpC0nVYEcSMyU60JCDdTfYUTtcoq85EF0ISTHogAmBOAWTODOfAOga2eG/aT1hO2dK1OAOxa8/gvTluumzUxAJyG0rG75IbzIgsIB9u4qi0Bjdtrf6boV0DAzxKU2+Zalm1iAG6bh0ft+Ifnh/2MLABdfO+BI2ALtVTbzLDFw4Miflj3QzqRBYyMNL2hTvQsJH7oMsZk7NAT/hZGFsDz8tn4ZdqtMy7AdSIeNDHCuyYQ21YxaRD11BLAJLxbo9n4SOIeMDH6Zns/P9z0ljF1LIIAHfj6z9kSUP89VjNoXwH6sd9FvwNmVy1T6KqkMc1X4gWNtQUA4m0EOMTGfhWBab4K0D+gL8Afr+FRfQFC3KL+/5kNyK9aOcU4x6aVrwL0D2gLyOean1D/P7xq5FfCm+Yr8YLG2gKCABsd1xZg2mVqzQ+7EdoCuPNwB2Jjv4pwqwtVbYlvQP8KmHaZWvN9l1sd1BZg2mVqza9eqn9EW4A/XOOj2gI2qouYStYWwJ2HOxAb+6YL0Z2vL6AGY/PzgdfNLwZFKKPaGnCBaX0BG9RFAlcWMhEogL6ELcgYyb5fR+VxrS5SuDRwtnCxH0MZ1crYlVyU+0bmewYKAAFlz2jQLQ4m+pyDvigbGEzYi4eZS4akNzT8LkIOrfvBAgBz61XkIGJnTMCXdJj3xAY1MRCfmIsoSyeKodKg3AsUkM81TQGImfLyTRgJeJrPNsuP4MsWESiAq4rL27rpjeEr9jfFBLxcjlm2ilspYGxsxwL9s7a7CD0kZIruxa8qsI3ICRDzxDXJnCO5+IXxBzu/q3CVAryJo8PxRySkI5+L76cnaXV9T0y3ywHi6mROj1/1GUqACmCzc38AAAD//w67zGwAAAAGSURBVAMAbxdAjjY32OwAAAAASUVORK5CYII='
          />
          <span className='font-display-sm text-display-sm font-bold tracking-tighter text-primary'>CalcAPI</span>
        </div>
        <nav className='hidden md:flex ml-lg gap-lg h-full items-center'>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`h-full flex items-center pb-1 font-label-md text-label-md mt-1 transition-colors ${
              activeTab === 'calculator'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('api-reference')}
            className={`h-full flex items-center pb-1 font-label-md text-label-md mt-1 transition-colors ${
              activeTab === 'api-reference'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            API Reference
          </button>
        </nav>
      </div>
      <div className='flex items-center gap-sm bg-surface-container-high py-sm px-md rounded-full border border-outline-variant/30'>
        <div className='w-2 h-2 rounded-full bg-secondary-fixed pulse-dot'></div>
        <span className='font-label-sm text-label-sm text-on-surface-variant'>API Status: Connected</span>
      </div>
    </header>
  );
}

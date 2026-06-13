'use client';

import { useState } from 'react';
import { Search, ChevronRight, Info, FileText, X, Filter, Loader2, Tag } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface HSCode {
  code: string;
  desc: string;
  category: string;
  duty: string;
  vat: string;
  docs: string[];
}

// ─────────────────────────────────────────────────────────────
// STATIC DATA (hardcoded — 12 codes for demo)
//
// TODO: API — Replace with a real HS code database call
//   GET /api/hs-codes?q=<query>&category=<cat>&page=<n>&limit=20
//   Expected response: { results: HSCode[], total: number, page: number }
// ─────────────────────────────────────────────────────────────
const HS_DATA: HSCode[] = [
  { code: '8471.30', desc: 'Laptop computers (portable ADP machines)', category: 'Electronics', duty: '0%',   vat: '20%', docs: ['Commercial Invoice', 'Packing List', 'CE Declaration'] },
  { code: '6101.20', desc: "Men's overcoats, anoraks – knitted cotton",  category: 'Textiles',    duty: '12%',  vat: '20%', docs: ['Commercial Invoice', 'CoO', 'Textile Certificate'] },
  { code: '0901.11', desc: 'Coffee, not roasted, not decaffeinated',      category: 'Food & Agri', duty: '7.5%', vat: '0%',  docs: ['Phytosanitary Certificate', 'CoO', 'Invoice'] },
  { code: '3004.90', desc: 'Medicaments (mixed) for retail sale',          category: 'Pharma',      duty: '0%',   vat: '0%',  docs: ['FDA Approval', 'GMP Certificate', 'Invoice'] },
  { code: '8703.23', desc: 'Motor cars, cylinder capacity 1500–3000cc',    category: 'Automotive',  duty: '6.5%', vat: '20%', docs: ['Type Approval', 'CoC', 'Invoice', 'Insurance'] },
  { code: '2701.12', desc: 'Bituminous coal, not agglomerated',            category: 'Energy',      duty: '0%',   vat: '20%', docs: ['Quality Certificate', 'Invoice', 'B/L'] },
  { code: '9403.30', desc: 'Wooden furniture for offices',                 category: 'Furniture',   duty: '2.7%', vat: '20%', docs: ['Commercial Invoice', 'Packing List'] },
  { code: '8544.42', desc: 'Electric conductors, voltage ≤ 80V',           category: 'Electronics', duty: '2.5%', vat: '20%', docs: ['Commercial Invoice', 'Test Report', 'CoO'] },
  { code: '3301.29', desc: 'Essential oils — bergamot, lavender',          category: 'Chemicals',   duty: '3.2%', vat: '20%', docs: ['MSDS', 'Invoice', 'Certificate of Analysis'] },
  { code: '7308.90', desc: 'Structures of iron or steel — bridges',        category: 'Steel',       duty: '0%',   vat: '20%', docs: ['Mill Certificate', 'Invoice'] },
  { code: '8507.60', desc: 'Lithium-ion accumulators (batteries)',          category: 'Electronics', duty: '1.8%', vat: '20%', docs: ['UN38.3 Report', 'MSDS', 'Invoice'] },
  { code: '0302.11', desc: 'Trout, fresh or chilled (Salmo trutta)',        category: 'Food & Agri', duty: '12%',  vat: '0%',  docs: ['Health Certificate', 'Catch Certificate', 'Invoice'] },
];

const CATEGORIES = ['All', 'Electronics', 'Textiles', 'Food & Agri', 'Pharma', 'Automotive', 'Energy', 'Furniture', 'Chemicals', 'Steel'];

const CAT_COLORS: Record<string, { color: string; bg: string }> = {
  Electronics: { color: '#0066FF', bg: '#EBF2FF' },
  Textiles:    { color: '#7C3AED', bg: '#F5F3FF' },
  'Food & Agri':{ color: '#059669', bg: '#ECFDF5' },
  Pharma:      { color: '#0891B2', bg: '#ECFEFF' },
  Automotive:  { color: '#DC2626', bg: '#FFF1F2' },
  Energy:      { color: '#D97706', bg: '#FFFBEB' },
  Furniture:   { color: '#92400E', bg: '#FEF3C7' },
  Chemicals:   { color: '#9333EA', bg: '#FAF5FF' },
  Steel:       { color: '#374151', bg: '#F9FAFB' },
};

export default function HSCodesPage() {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<HSCode | null>(null);
  const [loading,  setLoading]  = useState(false); // Will be true during real API calls

  // TODO: API — Replace this client-side filter with a real fetch + debounce (300ms)
  const results = HS_DATA.filter(item => {
    const matchQ = !query || item.code.includes(query) || item.desc.toLowerCase().includes(query.toLowerCase());
    const matchC = category === 'All' || item.category === category;
    return matchQ && matchC;
  });

  const catStyle = (cat: string) => CAT_COLORS[cat] ?? { color: 'var(--muted)', bg: 'var(--bg)' };

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg)' }}>

      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <div className="animate-fadeUp">
            <div className="label">HS Code Directory</div>
          </div>
          <h1 className="animate-fadeUp delay-1" style={{ marginBottom: '0.875rem' }}>Harmonized System Codes</h1>
          <p className="animate-fadeUp delay-2" style={{ maxWidth: 520, fontSize: '1.0625rem', marginBottom: '1.75rem' }}>
            Search any product to find its HS code, duty rate, VAT, and required import documents.
          </p>

          {/* Search input */}
          <div className="animate-fadeUp delay-3" style={{
            display: 'flex',
            background: 'var(--surface)',
            border: '2px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            maxWidth: 580,
            boxShadow: 'var(--shadow)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
            onFocusCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 4px rgba(0,102,255,0.1), var(--shadow)'; }}
            onBlurCapture={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
              {loading
                ? <Loader2 size={17} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
                : <Search size={17} color="var(--muted)" />
              }
            </div>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by product name or HS code…"
              style={{
                flex: 1, padding: '0.9375rem 0', border: 'none',
                background: 'transparent', outline: 'none',
                fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif', color: 'var(--navy)',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0 1rem', color: 'var(--muted)', display: 'flex', alignItems: 'center',
              }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: '2rem 1.5rem' }}>

        {/* Category filter pills */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.75rem', alignItems: 'center' }}>
          <Filter size={14} color="var(--muted)" style={{ marginRight: '0.25rem', flexShrink: 0 }} />
          {CATEGORIES.map(cat => {
            const cs = catStyle(cat);
            const active = category === cat;
            return (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '0.35rem 0.875rem',
                borderRadius: 'var(--radius-pill)',
                border: `1.5px solid ${active ? cs.color : 'var(--border)'}`,
                background: active ? cs.bg : 'var(--surface)',
                color: active ? cs.color : 'var(--muted)',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                boxShadow: active ? `0 2px 8px ${cs.color}20` : 'none',
              }}>
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results + detail panel */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* Results list */}
          <div>
            <div style={{
              fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '1rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <Tag size={13} />
              <strong style={{ color: 'var(--navy)' }}>{results.length}</strong> result{results.length !== 1 ? 's' : ''}
              {category !== 'All' && <span> in <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{category}</span></span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {results.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--muted)' }}>
                  <Search size={36} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  <p style={{ margin: 0, fontWeight: 500 }}>No HS codes match your search.</p>
                  <p style={{ margin: '0.375rem 0 0', fontSize: '0.8125rem' }}>Try a different keyword or clear the filter.</p>
                </div>
              ) : results.map(item => {
                const cs = catStyle(item.category);
                const isSelected = selected?.code === item.code;
                return (
                  <button key={item.code}
                    onClick={() => setSelected(isSelected ? null : item)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.25rem', width: '100%', textAlign: 'left',
                      background: isSelected ? `${cs.color}06` : 'var(--surface)',
                      border: `1.5px solid ${isSelected ? cs.color : 'var(--border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.15s',
                      boxShadow: isSelected ? `0 4px 16px ${cs.color}15` : 'var(--shadow-xs)',
                    }}
                    onMouseEnter={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = cs.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${cs.color}15`; }}}
                    onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xs)'; }}}
                  >
                    {/* Code chip */}
                    <span style={{
                      fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 700,
                      color: isSelected ? cs.color : 'var(--navy)',
                      background: isSelected ? cs.bg : 'var(--bg)',
                      padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${isSelected ? cs.color + '40' : 'var(--border)'}`,
                      whiteSpace: 'nowrap', minWidth: 80, textAlign: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {item.code}
                    </span>

                    {/* Description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.desc}
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 600,
                          padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)',
                          background: cs.bg, color: cs.color,
                          border: `1px solid ${cs.color}25`,
                        }}>{item.category}</span>
                        <span className="badge badge-amber">Duty {item.duty}</span>
                        <span className="badge badge-blue">VAT {item.vat}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} color={isSelected ? cs.color : 'var(--muted)'} style={{ flexShrink: 0, transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (() => {
            const cs = catStyle(selected.category);
            return (
              <div className="card" style={{ position: 'sticky', top: 84, border: `1.5px solid ${cs.color}30`, boxShadow: `0 8px 30px ${cs.color}15` }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, color: cs.color,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    background: cs.bg, border: `1px solid ${cs.color}25`,
                    borderRadius: 'var(--radius-pill)', padding: '0.2rem 0.625rem',
                  }}>Details</span>
                  <button onClick={() => setSelected(null)} style={{
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    cursor: 'pointer', color: 'var(--muted)',
                    width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 'var(--radius)',
                  }}>
                    <X size={14} />
                  </button>
                </div>

                <div style={{ fontFamily: 'monospace', fontSize: '1.875rem', fontWeight: 800, color: cs.color, marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
                  {selected.code}
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: 'var(--navy-2)', lineHeight: 1.65 }}>
                  {selected.desc}
                </p>

                {/* Rate rows */}
                {[
                  { label: 'Category',    value: selected.category },
                  { label: 'Import Duty', value: selected.duty, highlight: true },
                  { label: 'VAT / GST',   value: selected.vat },
                ].map(({ label, value, highlight }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{label}</span>
                    <span style={{
                      fontWeight: 700, fontSize: '0.9rem',
                      color: highlight ? cs.color : 'var(--navy)',
                      background: highlight ? cs.bg : 'transparent',
                      padding: highlight ? '0.15rem 0.5rem' : '0',
                      borderRadius: highlight ? 'var(--radius-pill)' : '0',
                    }}>{value}</span>
                  </div>
                ))}

                {/* Documents */}
                <div style={{ marginTop: '1.375rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '0.75rem' }}>
                    Required Documents
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {selected.docs.map(doc => (
                      <div key={doc} style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        fontSize: '0.8125rem', color: 'var(--navy-2)',
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.625rem',
                      }}>
                        <FileText size={13} color={cs.color} style={{ flexShrink: 0 }} /> {doc}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div style={{ marginTop: '1.375rem', padding: '0.875rem', background: 'var(--bg)', borderRadius: 'var(--radius)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', border: '1px solid var(--border)' }}>
                  <Info size={13} color="var(--muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: '0.75rem', margin: 0, lineHeight: 1.6, color: 'var(--muted)' }}>
                    Rates are indicative. Actual duties depend on origin, trade agreements, and current regulations.
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

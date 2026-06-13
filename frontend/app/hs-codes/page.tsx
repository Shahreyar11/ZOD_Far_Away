'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronRight, Info, FileText, X, Loader2, Tag } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface HSCode {
  hsn4Digit: string;
  hsn8Digit: string;
  productName: string;
  gstRate: string;
}

export default function HSCodesPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HSCode[]>([]);
  const [selected, setSelected] = useState<HSCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Debounced search
  useEffect(() => {
  if (!query.trim()) return;

  const timer = setTimeout(async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(
        `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
      );

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();

      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [query]);

  // General theme styling matching the previous layout
  const themeColor = '#0066FF';
  const themeBg = '#EBF2FF';

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
            Search any product using our AI-powered engine to find its official HS code and GST rate instantly.
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
              placeholder="Search by product name (e.g. potato, laptop, ceramic)..."
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
          {error && <div style={{ color: 'var(--error)', marginTop: '0.5rem', fontSize: '0.875rem' }}>{error}</div>}
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: '2rem 1.5rem' }}>

        {/* Results + detail panel */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* Results list */}
          <div>
            {query && (
              <div style={{
                fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <Tag size={13} />
                <strong style={{ color: 'var(--navy)' }}>{results.length}</strong> result{results.length !== 1 ? 's' : ''} found
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {!query ? (
                 <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--muted)' }}>
                  <Search size={36} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  <p style={{ margin: 0, fontWeight: 500 }}>Start searching to find HS Codes.</p>
                  <p style={{ margin: '0.375rem 0 0', fontSize: '0.8125rem' }}>Our AI handles synonyms, so just type naturally.</p>
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--muted)' }}>
                  <Search size={36} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  <p style={{ margin: 0, fontWeight: 500 }}>No HS codes match your search.</p>
                  <p style={{ margin: '0.375rem 0 0', fontSize: '0.8125rem' }}>Try a different keyword.</p>
                </div>
              ) : results.map((item, index) => {
                const isSelected = selected?.hsn8Digit === item.hsn8Digit && selected?.productName === item.productName;
                return (
                  <button key={index}
                    onClick={() => setSelected(isSelected ? null : item)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.25rem', width: '100%', textAlign: 'left',
                      background: isSelected ? `${themeColor}06` : 'var(--surface)',
                      border: `1.5px solid ${isSelected ? themeColor : 'var(--border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.15s',
                      boxShadow: isSelected ? `0 4px 16px ${themeColor}15` : 'var(--shadow-xs)',
                    }}
                    onMouseEnter={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = themeColor; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${themeColor}15`; }}}
                    onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xs)'; }}}
                  >
                    {/* Code chip */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{
                        fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 700,
                        color: isSelected ? themeColor : 'var(--navy)',
                        background: isSelected ? themeBg : 'var(--bg)',
                        padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isSelected ? themeColor + '40' : 'var(--border)'}`,
                        whiteSpace: 'nowrap', minWidth: 80, textAlign: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {item.hsn8Digit || 'N/A'}
                      </span>
                    </div>

                    {/* Description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productName}
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-amber">GST: {item.gstRate}</span>
                        {item.hsn4Digit && <span className="badge" style={{ background: '#F3F4F6', color: '#4B5563' }}>HSN4: {item.hsn4Digit}</span>}
                      </div>
                    </div>
                    <ChevronRight size={16} color={isSelected ? themeColor : 'var(--muted)'} style={{ flexShrink: 0, transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (() => {
            return (
              <div className="card animate-fadeUp" style={{ position: 'sticky', top: 84, border: `1.5px solid ${themeColor}30`, boxShadow: `0 8px 30px ${themeColor}15` }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, color: themeColor,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    background: themeBg, border: `1px solid ${themeColor}25`,
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

                <div style={{ fontFamily: 'monospace', fontSize: '1.875rem', fontWeight: 800, color: themeColor, marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
                  {selected.hsn8Digit || selected.hsn4Digit || 'N/A'}
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: 'var(--navy-2)', lineHeight: 1.65 }}>
                  {selected.productName}
                </p>

                {/* Rate rows */}
                {[
                  { label: 'HSN 8-Digit', value: selected.hsn8Digit || 'N/A' },
                  { label: 'HSN 4-Digit', value: selected.hsn4Digit || 'N/A' },
                  { label: 'GST Rate',    value: selected.gstRate, highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{label}</span>
                    <span style={{
                      fontWeight: 700, fontSize: '0.9rem',
                      color: highlight ? themeColor : 'var(--navy)',
                      background: highlight ? themeBg : 'transparent',
                      padding: highlight ? '0.15rem 0.5rem' : '0',
                      borderRadius: highlight ? 'var(--radius-pill)' : '0',
                    }}>{value}</span>
                  </div>
                ))}

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

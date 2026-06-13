'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronRight, X, Loader2, Tag } from 'lucide-react';
import Link from 'next/link';

interface HSCode {
  hsn4Digit: string;
  hsn8Digit: string;
  productName: string;
}

export default function HSCodesPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HSCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const themeColor = '#0066FF';
  // const themeBg = '#EBF2FF';

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg)' }}>

      <div className="page-header">
        <div className="container">
          <div className="animate-fadeUp">
            <div className="label">Product Search</div>
          </div>
          <h1 className="animate-fadeUp delay-1" style={{ marginBottom: '0.875rem' }}>Global Trade Database</h1>
          <p className="animate-fadeUp delay-2" style={{ maxWidth: 520, fontSize: '1.0625rem', marginBottom: '1.75rem' }}>
            Search any product to find its official HS code and analyze compliance, taxes, and estimated freight costs.
          </p>

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

      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 800 }}>
        {query && (
          <div style={{
            fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <Tag size={13} />
            <strong style={{ color: 'var(--navy)' }}>{results.length}</strong> result{results.length !== 1 ? 's' : ''} found
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {!query ? (
             <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--muted)' }}>
              <Search size={36} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p style={{ margin: 0, fontWeight: 500 }}>Start searching to find products.</p>
              <p style={{ margin: '0.375rem 0 0', fontSize: '0.8125rem' }}>Our AI handles synonyms, so just type naturally.</p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--muted)' }}>
              <Search size={36} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p style={{ margin: 0, fontWeight: 500 }}>No products match your search.</p>
              <p style={{ margin: '0.375rem 0 0', fontSize: '0.8125rem' }}>Try a different keyword.</p>
            </div>
          ) : results.map((item, index) => {
            return (
              <Link href={`/product/${item.hsn8Digit || item.hsn4Digit}`} key={index} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                    padding: '1.25rem', width: '100%', textAlign: 'left',
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = themeColor; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${themeColor}15`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 700,
                      color: 'var(--navy)',
                      background: 'var(--bg)',
                      padding: '0.4rem 0.875rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      whiteSpace: 'nowrap', minWidth: 80, textAlign: 'center',
                    }}>
                      HS: {item.hsn8Digit || item.hsn4Digit || 'N/A'}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.productName}
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--muted)" style={{ flexShrink: 0 }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

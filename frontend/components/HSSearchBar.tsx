"use client";

import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchResult {
  hsn4Digit: string;
  hsn8Digit: string;
  productName: string;
  gstRate: string;
}

export default function HSSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        // Assume backend is running on port 5000
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) {
          throw new Error('Search failed');
        }
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setResults(data.results || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch results.');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto 2.5rem', zIndex: 50 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1.5px solid rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.5rem 1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <Search color="rgba(255,255,255,0.7)" size={20} style={{ marginRight: '0.75rem' }} />
        <input
          type="text"
          placeholder="Search product (e.g. mobile phone, pumps, ceramic)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            width: '100%',
            fontSize: '1rem',
            padding: '0.5rem 0'
          }}
        />
        {loading && <Loader2 size={20} color="rgba(255,255,255,0.7)" className="animate-spin" />}
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          textAlign: 'left',
          maxHeight: 350,
          overflowY: 'auto'
        }}>
          {error && (
             <div style={{ padding: '1rem', color: 'var(--error)', fontSize: '0.875rem' }}>{error}</div>
          )}
          {!loading && !error && results.length === 0 && (
            <div style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.875rem' }}>No HS codes found for "{query}".</div>
          )}
          {results.map((r, i) => (
            <div key={i} style={{
              padding: '1rem',
              borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.9375rem' }}>
                  {r.productName}
                </span>
                <span style={{ 
                  background: 'var(--accent-bg)', 
                  color: 'var(--accent)', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  GST: {r.gstRate}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                <span><strong style={{ color: '#4b5563' }}>HSN 4:</strong> {r.hsn4Digit}</span>
                <span><strong style={{ color: '#4b5563' }}>HSN 8:</strong> {r.hsn8Digit}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

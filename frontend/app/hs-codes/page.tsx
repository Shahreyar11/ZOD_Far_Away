'use client';

import { useState } from 'react';
import { Search, ChevronRight, Info, AlertCircle, Tag, FileText, Globe, Filter } from 'lucide-react';
import type { Metadata } from 'next';

const hsData = [
  { code: '8471.30', desc: 'Laptop computers (portable ADP machines)', category: 'Electronics', duty: '0%', vat: '20%', docs: ['Commercial Invoice', 'Packing List', 'CE Declaration'] },
  { code: '6101.20', desc: "Men's overcoats, anoraks, windbreakers – knitted cotton", category: 'Textiles', duty: '12%', vat: '20%', docs: ['Commercial Invoice', 'CoO', 'Textile Certificate'] },
  { code: '0901.11', desc: 'Coffee, not roasted, not decaffeinated', category: 'Food & Agri', duty: '7.5%', vat: '0%', docs: ['Phytosanitary Certificate', 'CoO', 'Invoice'] },
  { code: '3004.90', desc: 'Medicaments (mixed or not) for retail sale', category: 'Pharma', duty: '0%', vat: '0%', docs: ['FDA Approval', 'GMP Certificate', 'Invoice'] },
  { code: '8703.23', desc: 'Motor cars with cylinder capacity 1500–3000cc', category: 'Automotive', duty: '6.5%', vat: '20%', docs: ['Type Approval', 'CoC', 'Invoice', 'Insurance'] },
  { code: '2701.12', desc: 'Bituminous coal, not agglomerated', category: 'Energy', duty: '0%', vat: '20%', docs: ['Quality Certificate', 'Invoice', 'B/L'] },
  { code: '9403.30', desc: 'Wooden furniture for offices', category: 'Furniture', duty: '2.7%', vat: '20%', docs: ['Commercial Invoice', 'CITES if applicable', 'Packing List'] },
  { code: '8544.42', desc: 'Electric conductors, voltage not exceeding 80V', category: 'Electronics', duty: '2.5%', vat: '20%', docs: ['Commercial Invoice', 'Test Report', 'CoO'] },
  { code: '3301.29', desc: 'Essential oils, other than citrus – bergamot, lavender', category: 'Chemicals', duty: '3.2%', vat: '20%', docs: ['MSDS', 'Invoice', 'Certificate of Analysis'] },
  { code: '7308.90', desc: 'Structures of iron or steel — bridges, bridge sections', category: 'Steel & Metal', duty: '0%', vat: '20%', docs: ['Mill Certificate', 'Invoice', 'Structural Drawing'] },
  { code: '8507.60', desc: 'Lithium-ion accumulators (batteries)', category: 'Electronics', duty: '1.8%', vat: '20%', docs: ['UN38.3 Report', 'MSDS', 'Invoice'] },
  { code: '0302.11', desc: 'Trout, fresh or chilled (Salmo trutta)', category: 'Food & Agri', duty: '12%', vat: '0%', docs: ['Health Certificate', 'Catch Certificate', 'Invoice'] },
];

const categories = ['All', 'Electronics', 'Textiles', 'Food & Agri', 'Pharma', 'Automotive', 'Energy', 'Furniture', 'Chemicals', 'Steel & Metal'];

export default function HSCodesPage() {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selected, setSelected] = useState<typeof hsData[0] | null>(null);

  const filtered = hsData.filter(item => {
    const matchQ = query === '' || item.code.includes(query) || item.desc.toLowerCase().includes(query.toLowerCase());
    const matchC = selectedCat === 'All' || item.category === selectedCat;
    return matchQ && matchC;
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
        padding: '4rem 0 3rem',
      }}>
        <div className="container">
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            <Tag size={14} /> HS Code Directory
          </div>
          <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>Harmonized System <span className="text-gradient">Code Explorer</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.0625rem', maxWidth: 560, lineHeight: 1.7 }}>
            Search any product to find its HS code, applicable duty rates, VAT, and required import documentation for 200+ countries.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 14,
            overflow: 'hidden',
            maxWidth: 600,
            marginTop: '2rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
              <Search size={18} color="rgba(255,255,255,0.4)" />
            </div>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by product name or HS code…"
              style={{
                flex: 1,
                padding: '1rem 0',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.9375rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                padding: '0 1rem', cursor: 'pointer', fontSize: '1.25rem',
              }}>×</button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-muted)" />
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCat(cat)}
              style={{
                padding: '0.375rem 1rem',
                borderRadius: 50,
                border: `1.5px solid ${selectedCat === cat ? 'var(--teal)' : 'var(--border)'}`,
                background: selectedCat === cat ? 'rgba(0,180,216,0.1)' : '#fff',
                color: selectedCat === cat ? 'var(--teal)' : 'var(--text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
              }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Results */}
          <div>
            <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filtered.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <AlertCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>No results found</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Try a different search term or category.</p>
                </div>
              ) : filtered.map(item => (
                <div key={item.code}
                  onClick={() => setSelected(selected?.code === item.code ? null : item)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    border: selected?.code === item.code ? '2px solid var(--teal)' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                    <div style={{
                      background: 'var(--navy)',
                      color: '#fff',
                      borderRadius: 10,
                      padding: '0.375rem 0.875rem',
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.code}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>{item.desc}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-teal">{item.category}</span>
                        <span className="badge badge-amber">Duty: {item.duty}</span>
                        <span className="badge badge-navy">VAT: {item.vat}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} color={selected?.code === item.code ? 'var(--teal)' : 'var(--text-muted)'}
                    style={{ transform: selected?.code === item.code ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '1rem' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="card" style={{ position: 'sticky', top: '90px', border: '2px solid rgba(0,180,216,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--navy)' }}>Code Details</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.25rem' }}>×</button>
              </div>
              <div style={{
                fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800,
                color: 'var(--teal)', marginBottom: '0.5rem',
              }}>{selected.code}</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{selected.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Category', value: selected.category },
                  { label: 'Import Duty', value: selected.duty, color: '#E07B39' },
                  { label: 'VAT / GST', value: selected.vat, color: 'var(--navy)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Required Documents
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selected.docs.map(doc => (
                    <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <FileText size={14} color="var(--teal)" />
                      {doc}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'rgba(0,180,216,0.07)', borderRadius: 10, border: '1px solid rgba(0,180,216,0.15)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Info size={14} color="var(--teal)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Rates shown are indicative. Actual duties may vary by origin country, trade agreements, and current regulations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator, ArrowRight, Info, DollarSign, Package2,
  Ship, Plane, Truck, RefreshCw, Download, ChevronDown,
} from 'lucide-react';

const countries = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Japan',
  'China', 'India', 'UAE', 'Saudi Arabia', 'Australia', 'Canada',
  'Brazil', 'South Korea', 'Singapore', 'Netherlands', 'Italy',
  'Spain', 'Mexico', 'Indonesia', 'South Africa',
];

const hsExamples = [
  { code: '8471.30', label: 'Laptops', duty: 0 },
  { code: '6101.20', label: 'Cotton Clothing', duty: 12 },
  { code: '0901.11', label: 'Coffee (unroasted)', duty: 7.5 },
  { code: '8703.23', label: 'Passenger Cars', duty: 6.5 },
  { code: '9403.30', label: 'Office Furniture', duty: 2.7 },
  { code: '3004.90', label: 'Pharmaceuticals', duty: 0 },
  { code: '8507.60', label: 'Lithium Batteries', duty: 1.8 },
];

const freightRates = {
  air: { rate: 0.05, label: 'Air Freight', min: 150, icon: Plane },    // per kg
  sea: { rate: 0.008, label: 'Sea Freight', min: 800, icon: Ship },    // per kg
  road: { rate: 0.02, label: 'Road Freight', min: 200, icon: Truck },  // per kg
};

const vatRates: Record<string, number> = {
  'United Kingdom': 20, 'Germany': 19, 'France': 20, 'Italy': 22,
  'Spain': 21, 'Netherlands': 21, 'Australia': 10, 'Japan': 10,
  'Canada': 5, 'India': 18, 'United States': 0, 'UAE': 5,
  'Saudi Arabia': 15, 'Brazil': 12, 'Singapore': 9, 'South Korea': 10,
  'Mexico': 16, 'China': 13, 'Indonesia': 11, 'South Africa': 15,
};

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CostCalculatorPage() {
  const [productValue, setProductValue] = useState('5000');
  const [weight, setWeight] = useState('50');
  const [quantity, setQuantity] = useState('100');
  const [origin, setOrigin] = useState('China');
  const [destination, setDestination] = useState('United Kingdom');
  const [selectedHS, setSelectedHS] = useState(hsExamples[0]);
  const [freight, setFreight] = useState<'air' | 'sea' | 'road'>('sea');
  const [insurance, setInsurance] = useState(true);
  const [breakdown, setBreakdown] = useState<null | {
    productValue: number; freightCost: number; insuranceCost: number;
    cif: number; importDuty: number; vat: number; brokerageFee: number;
    total: number;
  }>(null);

  function calculate() {
    const pv = parseFloat(productValue) || 0;
    const wt = parseFloat(weight) || 0;
    const mode = freightRates[freight];
    const freightCost = Math.max(mode.min, wt * mode.rate * pv * 0.01 + mode.min);
    const insuranceCost = insurance ? pv * 0.012 : 0;
    const cif = pv + freightCost + insuranceCost;
    const dutyRate = selectedHS.duty / 100;
    const importDuty = cif * dutyRate;
    const vatRate = (vatRates[destination] || 0) / 100;
    const vat = (cif + importDuty) * vatRate;
    const brokerageFee = 180 + cif * 0.003;
    const total = pv + freightCost + insuranceCost + importDuty + vat + brokerageFee;
    setBreakdown({ productValue: pv, freightCost, insuranceCost, cif, importDuty, vat, brokerageFee, total });
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <div className="section-label"><Calculator size={14} /> Cost Estimator</div>
          <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>
            Landed Cost & <span className="text-gradient">Duty Calculator</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 560, lineHeight: 1.7, fontSize: '1.0625rem' }}>
            Calculate your full landed cost including import duties, VAT/GST, freight, insurance, and brokerage fees for any product and country pair.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {/* Calculator form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1.75rem', color: 'var(--navy)' }}>Shipment Details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* HS Code */}
              <div>
                <label>Product / HS Code</label>
                <select className="input select" value={selectedHS.code}
                  onChange={e => setSelectedHS(hsExamples.find(h => h.code === e.target.value) || hsExamples[0])}>
                  {hsExamples.map(h => <option key={h.code} value={h.code}>{h.code} — {h.label}</option>)}
                </select>
                <div style={{ marginTop: '0.375rem', fontSize: '0.8rem', color: 'var(--teal)' }}>
                  Import duty rate: <strong>{selectedHS.duty}%</strong>
                </div>
              </div>

              {/* Product value */}
              <div>
                <label>Product Value (USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                  <input className="input" type="number" value={productValue}
                    onChange={e => setProductValue(e.target.value)}
                    style={{ paddingLeft: '2rem' }} />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label>Gross Weight (kg)</label>
                <input className="input" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>

              {/* Quantity */}
              <div>
                <label>Quantity (units)</label>
                <input className="input" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
              </div>

              {/* Route */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label>Origin Country</label>
                  <select className="input select" value={origin} onChange={e => setOrigin(e.target.value)}>
                    {countries.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Destination</label>
                  <select className="input select" value={destination} onChange={e => setDestination(e.target.value)}>
                    {countries.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Freight mode */}
              <div>
                <label>Freight Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
                  {(Object.entries(freightRates) as [typeof freight, typeof freightRates['air']][]).map(([key, { label, icon: Icon }]) => (
                    <button key={key} onClick={() => setFreight(key)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: 12,
                        border: `2px solid ${freight === key ? 'var(--teal)' : 'var(--border)'}`,
                        background: freight === key ? 'rgba(0,180,216,0.08)' : '#fff',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem',
                        color: freight === key ? 'var(--teal)' : 'var(--text-muted)',
                        fontWeight: 600, fontSize: '0.8rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.2s ease',
                      }}>
                      <Icon size={18} />
                      {label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insurance toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none', color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.9375rem' }}>
                <input type="checkbox" checked={insurance} onChange={e => setInsurance(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--teal)', cursor: 'pointer' }} />
                Include cargo insurance (1.2% of CIF value)
              </label>

              <button onClick={calculate} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                <Calculator size={18} /> Calculate Landed Cost
              </button>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!breakdown ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                <Calculator size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Enter details and calculate</h3>
                <p style={{ fontSize: '0.875rem' }}>Your full cost breakdown will appear here.</p>
              </div>
            ) : (
              <>
                {/* Total highlight */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
                  borderRadius: 20, padding: '2rem', textAlign: 'center',
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Landed Cost</div>
                  <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                    ${fmt(breakdown.total)}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {origin} → {destination} · {freightRates[freight].label}
                  </div>
                </div>

                {/* Breakdown rows */}
                <div className="card">
                  <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--navy)' }}>Cost Breakdown</h3>
                  {[
                    { label: 'Product Value (FOB)', value: breakdown.productValue, note: '' },
                    { label: 'Freight Cost', value: breakdown.freightCost, note: freightRates[freight].label },
                    ...(insurance ? [{ label: 'Cargo Insurance', value: breakdown.insuranceCost, note: '1.2% of CIF' }] : []),
                    { label: 'CIF Value', value: breakdown.cif, note: 'Cost + Insurance + Freight', divider: true },
                    { label: `Import Duty (${selectedHS.duty}%)`, value: breakdown.importDuty, note: `HS ${selectedHS.code}` },
                    { label: `VAT / GST (${vatRates[destination] || 0}%)`, value: breakdown.vat, note: destination },
                    { label: 'Customs Brokerage', value: breakdown.brokerageFee, note: 'Est. clearance fees' },
                  ].map(({ label, value, note, divider }: any) => (
                    <div key={label}>
                      {divider && <div className="divider" style={{ margin: '0.75rem 0' }} />}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: '1px solid var(--border)' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{label}</div>
                          {note && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{note}</div>}
                        </div>
                        <div style={{ fontWeight: 700, color: divider ? 'var(--navy)' : 'var(--text-primary)' }}>
                          ${fmt(value)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0 0', marginTop: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy)' }}>Total Landed Cost</span>
                    <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--teal-dark)' }}>${fmt(breakdown.total)}</span>
                  </div>
                </div>

                {/* Per-unit cost */}
                <div className="card" style={{ background: 'rgba(0,180,216,0.07)', border: '1px solid rgba(0,180,216,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Cost Per Unit</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Based on {quantity} units</div>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--teal-dark)' }}>
                      ${fmt(breakdown.total / (parseFloat(quantity) || 1))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setBreakdown(null)} className="btn btn-outline" style={{ flex: 1 }}>
                    <RefreshCw size={16} /> Reset
                  </button>
                  <Link href="/contact" className="btn btn-amber" style={{ flex: 1, justifyContent: 'center' }}>
                    Get Official Quote <ArrowRight size={16} />
                  </Link>
                </div>

                <div style={{ padding: '0.875rem 1.125rem', background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.2)', borderRadius: 12, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Info size={15} color="#E07B39" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: '0.8rem', color: '#9C4221', lineHeight: 1.6 }}>
                    This is an estimate for planning purposes. Actual costs may vary based on current carrier rates, exchange rates, specific customs rulings, and tariff classification.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

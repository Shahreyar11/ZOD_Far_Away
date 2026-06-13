/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Info, RefreshCw, Plane, Ship, Truck } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type FreightMode = 'air' | 'sea' | 'road';

interface CostBreakdown {
  productValue:  number;
  freightCost:   number;
  insuranceCost: number;
  cif:           number;
  importDuty:    number;
  vat:           number;
  brokerageFee:  number;
  total:         number;
}

// TODO: API — Replace HS_EXAMPLES with real search: GET /api/hs-codes
const HS_EXAMPLES = [
  { code: '8471.30', label: 'Laptops',            duty: 0   },
  { code: '6101.20', label: 'Cotton Clothing',     duty: 12  },
  { code: '0901.11', label: 'Coffee (unroasted)',  duty: 7.5 },
  { code: '8703.23', label: 'Passenger Cars',      duty: 6.5 },
  { code: '9403.30', label: 'Office Furniture',    duty: 2.7 },
  { code: '3004.90', label: 'Pharmaceuticals',     duty: 0   },
  { code: '8507.60', label: 'Lithium Batteries',   duty: 1.8 },
];

// TODO: API — Replace with live freight quotes (Flexport / Freightos API)
const FREIGHT_RATES: Record<FreightMode, { label: string; icon: React.ElementType; minUSD: number; ratePerKg: number; color: string; bg: string }> = {
  air:  { label: 'Air Freight',  icon: Plane, minUSD: 150, ratePerKg: 4.5,  color: '#0066FF', bg: '#EBF2FF' },
  sea:  { label: 'Sea Freight',  icon: Ship,  minUSD: 800, ratePerKg: 0.35, color: '#0D9488', bg: '#EDFAF9' },
  road: { label: 'Road Freight', icon: Truck, minUSD: 200, ratePerKg: 1.20, color: '#7C3AED', bg: '#F5F3FF' },
};

const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Japan',
  'China', 'India', 'UAE', 'Saudi Arabia', 'Australia', 'Canada',
  'Brazil', 'South Korea', 'Singapore', 'Netherlands', 'Italy',
  'Spain', 'Mexico', 'Indonesia', 'South Africa',
];

// TODO: API — Replace with real VAT rates (Avalara / TaxJar)
const VAT_RATES: Record<string, number> = {
  'United Kingdom': 20, 'Germany': 19, 'France': 20, 'Italy': 22,
  'Spain': 21, 'Netherlands': 21, 'Australia': 10, 'Japan': 10,
  'Canada': 5, 'India': 18, 'United States': 0, 'UAE': 5,
  'Saudi Arabia': 15, 'Brazil': 12, 'Singapore': 9, 'South Korea': 10,
  'Mexico': 16, 'China': 13, 'Indonesia': 11, 'South Africa': 15,
};

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CostCalculatorPage() {
  const [productValue, setProductValue] = useState('5000');
  const [weight,       setWeight]       = useState('50');
  const [quantity,     setQuantity]     = useState('100');
  const [origin,       setOrigin]       = useState('China');
  const [destination,  setDestination]  = useState('United Kingdom');
  const [selectedHS,   setSelectedHS]   = useState(HS_EXAMPLES[0]);
  const [mode,         setMode]         = useState<FreightMode>('sea');
  const [withInsurance,setInsurance]    = useState(true);
  const [result,       setResult]       = useState<CostBreakdown | null>(null);
  const [loading,      setLoading]      = useState(false);

  // TODO: API — Replace this entire function with a backend call:
  //   POST /api/calculate-landed-cost
  //   with hsCode, productValue, weightKg, quantity, origin, destination, freightMode, includeInsurance
  function calculate() {
    setLoading(true);
    setTimeout(() => {
      const pv  = parseFloat(productValue) || 0;
      const wt  = parseFloat(weight)       || 0;
      const r   = FREIGHT_RATES[mode];

      const freightCost    = Math.max(r.minUSD, wt * r.ratePerKg);
      const insuranceCost  = withInsurance ? pv * 0.012 : 0;
      const cif            = pv + freightCost + insuranceCost;
      const importDuty     = cif * (selectedHS.duty / 100);
      const vat            = (cif + importDuty) * ((VAT_RATES[destination] ?? 0) / 100);
      const brokerageFee   = 180 + cif * 0.003;
      const total          = pv + freightCost + insuranceCost + importDuty + vat + brokerageFee;

      setResult({ productValue: pv, freightCost, insuranceCost, cif, importDuty, vat, brokerageFee, total });
      setLoading(false);
    }, 500);
  }

  function reset() { setResult(null); }

  const qty = parseFloat(quantity) || 1;
  const modeData = FREIGHT_RATES[mode];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>

      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <div className="animate-fadeUp">
            <div className="label">Cost Estimator</div>
          </div>
          <h1 className="animate-fadeUp delay-1" style={{ marginBottom: '0.875rem' }}>Landed Cost Calculator</h1>
          <p className="animate-fadeUp delay-2" style={{ maxWidth: 520, fontSize: '1.0625rem' }}>
            Estimate import duties, VAT, freight, insurance, and brokerage for any product and country pair.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>

          {/* ── Input form ─────────────────────────────────────── */}
          <div className="card">
            <h2 style={{ fontSize: '1.0625rem', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              Shipment Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* HS Code */}
              <div>
                <label>Product / HS Code</label>
                {/* TODO: API — Replace with searchable input using GET /api/hs-codes?q=<query> */}
                <select className="input select" value={selectedHS.code}
                  onChange={e => setSelectedHS(HS_EXAMPLES.find(h => h.code === e.target.value)!)}>
                  {HS_EXAMPLES.map(h => (
                    <option key={h.code} value={h.code}>{h.code} — {h.label}</option>
                  ))}
                </select>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.375rem',
                  background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
                  borderRadius: 'var(--radius-pill)', padding: '0.2rem 0.625rem',
                }}>
                  Import duty: <strong>{selectedHS.duty}%</strong>
                </div>
              </div>

              {/* Product value */}
              <div>
                <label>Product Value (USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontWeight: 700 }}>$</span>
                  <input className="input" type="number" min="0" value={productValue}
                    onChange={e => setProductValue(e.target.value)}
                    style={{ paddingLeft: '1.875rem' }} />
                </div>
              </div>

              {/* Weight & Quantity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label>Gross Weight (kg)</label>
                  <input className="input" type="number" min="0" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
                <div>
                  <label>Quantity (units)</label>
                  <input className="input" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
                </div>
              </div>

              {/* Origin / Destination */}
              {/* TODO: API — Replace static list with country API or keep as-is */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label>Origin</label>
                  <select className="input select" value={origin} onChange={e => setOrigin(e.target.value)}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Destination</label>
                  <select className="input select" value={destination} onChange={e => setDestination(e.target.value)}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Freight mode */}
              {/* TODO: API — Replace static buttons with live quotes from freight API */}
              <div>
                <label>Freight Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem' }}>
                  {(Object.entries(FREIGHT_RATES) as [FreightMode, typeof FREIGHT_RATES['air']][]).map(([key, { label, icon: Icon, color, bg }]) => (
                    <button key={key} onClick={() => setMode(key)}
                      style={{
                        padding: '0.875rem 0.5rem',
                        borderRadius: 'var(--radius)',
                        border: `1.5px solid ${mode === key ? color : 'var(--border)'}`,
                        background: mode === key ? bg : 'var(--surface)',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                        color: mode === key ? color : 'var(--muted)',
                        fontWeight: 600, fontSize: '0.8rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s',
                        boxShadow: mode === key ? `0 3px 12px ${color}20` : 'none',
                      }}>
                      <Icon size={18} />
                      {label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insurance toggle */}
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                cursor: 'pointer', fontWeight: 400, fontSize: '0.875rem', color: 'var(--navy-2)',
                padding: '0.75rem 1rem',
                background: withInsurance ? 'var(--accent-bg)' : 'var(--bg)',
                border: `1.5px solid ${withInsurance ? 'var(--accent-border)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                transition: 'all 0.15s',
              }}>
                <input type="checkbox" checked={withInsurance} onChange={e => setInsurance(e.target.checked)}
                  style={{ width: 17, height: 17, accentColor: 'var(--accent)', cursor: 'pointer' }} />
                Include cargo insurance (1.2% of CIF)
              </label>

              <button onClick={calculate} className="btn btn-blue" style={{ justifyContent: 'center', padding: '0.9375rem' }} disabled={loading}>
                {loading ? 'Calculating…' : <><Calculator size={16} /> Calculate Landed Cost</>}
              </button>
            </div>
          </div>

          {/* ── Results ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!result ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--bg)', border: '2px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <Calculator size={30} color="var(--muted)" style={{ opacity: 0.4 }} />
                </div>
                <p style={{ margin: 0, fontWeight: 500, color: 'var(--navy)' }}>Ready to calculate?</p>
                <p style={{ margin: '0.375rem 0 0', fontSize: '0.875rem' }}>Fill in the form and hit calculate.</p>
              </div>
            ) : (
              <>
                {/* Total cost highlight */}
                <div style={{
                  background: 'var(--gradient-hero)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(0,102,255,0.2) 0%, transparent 65%)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', position: 'relative' }}>Total Landed Cost</div>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1, position: 'relative', letterSpacing: '-0.04em' }}>
                    ${fmt(result.total)}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.625rem', position: 'relative' }}>
                    {origin} → {destination} · {modeData.label}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="card">
                  <h3 style={{ fontSize: '0.9375rem', marginBottom: '1.25rem' }}>Cost Breakdown</h3>

                  {[
                    { label: 'Product Value (FOB)',                         value: result.productValue,   color: 'var(--navy)' },
                    { label: `Freight (${modeData.label})`,                 value: result.freightCost,    color: modeData.color },
                    ...(withInsurance ? [{ label: 'Cargo Insurance (1.2%)', value: result.insuranceCost,  color: 'var(--navy)' }] : []),
                    { label: 'CIF Value',                                   value: result.cif,            color: 'var(--navy)', divider: true },
                    { label: `Import Duty (${selectedHS.duty}%)`,           value: result.importDuty,     color: '#DC2626' },
                    { label: `VAT / GST (${VAT_RATES[destination] ?? 0}%)`, value: result.vat,            color: '#7C3AED' },
                    { label: 'Customs Brokerage (est.)',                    value: result.brokerageFee,   color: 'var(--navy)' },
                  ].map(({ label, value, divider, color }: any) => (
                    <div key={label}>
                      {divider && <div className="divider" style={{ margin: '0.75rem 0' }} />}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.5rem 0', borderBottom: divider ? 'none' : '1px solid var(--border)',
                      }}>
                        <span style={{ fontSize: '0.875rem', color: divider ? 'var(--navy)' : 'var(--muted)', fontWeight: divider ? 600 : 400 }}>{label}</span>
                        <span style={{ fontWeight: divider ? 800 : 600, fontSize: '0.9rem', color: divider ? 'var(--navy)' : color }}>${fmt(value)}</span>
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', marginTop: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: '1.375rem', color: 'var(--accent)' }}>${fmt(result.total)}</span>
                  </div>
                </div>

                {/* Per-unit */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Cost Per Unit</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{quantity} units total</div>
                  </div>
                  <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.04em' }}>
                    ${fmt(result.total / qty)}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={reset} className="btn btn-outline" style={{ flex: 1 }}>
                    <RefreshCw size={14} /> Reset
                  </button>
                  <Link href="/contact" className="btn btn-amber" style={{ flex: 1, justifyContent: 'center' }}>
                    Get Official Quote <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Disclaimer */}
                <div style={{
                  display: 'flex', gap: '0.5rem', padding: '1rem',
                  background: 'var(--bg)', borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}>
                  <Info size={13} color="var(--muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: '0.75rem', margin: 0, lineHeight: 1.65, color: 'var(--muted)' }}>
                    Estimates only. Actual costs vary with current carrier rates, FTA eligibility, and specific tariff rulings.
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

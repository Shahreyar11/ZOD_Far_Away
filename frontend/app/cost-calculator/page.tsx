/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calculator,
  ArrowRight,
  Info,
  RefreshCw,
  Plane,
  Ship,
  Truck,
  Search,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TYPES & CONFIGURATION
// ─────────────────────────────────────────────────────────────
type FreightMode = "air" | "sea" | "road";

interface CostBreakdown {
  productValue: number;
  freightCost: number;
  insuranceCost: number;
  cif: number;
  importDuty: number;
  vat: number;
  brokerageFee: number;
  total: number;
}

interface HSCodeData {
  gstRate: string | number;
  hsn4Digit: string;
  hsn8Digit: string;
  productName: string;
}

const FREIGHT_RATES: Record<FreightMode, { label: string; icon: React.ElementType; minUSD: number; ratePerKg: number; color: string; bg: string }> = {
  air: { label: "Air Freight", icon: Plane, minUSD: 150, ratePerKg: 4.5, color: "#0066FF", bg: "#EBF2FF" },
  sea: { label: "Sea Freight", icon: Ship, minUSD: 800, ratePerKg: 0.35, color: "#0D9488", bg: "#EDFAF9" },
  road: { label: "Road Freight", icon: Truck, minUSD: 200, ratePerKg: 1.2, color: "#7C3AED", bg: "#F5F3FF" },
};

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Japan", "China", "India", "UAE",
  "Saudi Arabia", "Australia", "Canada", "Brazil", "South Korea", "Singapore", "Netherlands",
  "Italy", "Spain", "Mexico", "Indonesia", "South Africa",
];

const VAT_RATES: Record<string, number> = {
  "United Kingdom": 20, Germany: 19, France: 20, Italy: 22, Spain: 21, Netherlands: 21,
  Australia: 10, Japan: 10, Canada: 5, India: 18, "United States": 0, UAE: 5,
  "Saudi Arabia": 15, Brazil: 12, Singapore: 9, "South Korea": 10, Mexico: 16,
  China: 13, Indonesia: 11, "South Africa": 15,
};

const GLOBAL_DUTY_ESTIMATES: Record<string, number> = {
  "84": 0.0, "85": 2.5, "61": 12.0, "87": 6.5, "09": 7.5, "94": 2.7, "30": 0.0,
};

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CostCalculatorPage() {
  const [productValue, setProductValue] = useState("5000");
  const [weight, setWeight] = useState("50");
  const [quantity, setQuantity] = useState("100");
  const [origin, setOrigin] = useState("China");
  const [destination, setDestination] = useState("United Kingdom");

  // ── Search State ─────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [hsOptions, setHsOptions] = useState<HSCodeData[]>([]);
  const [selectedHS, setSelectedHS] = useState<HSCodeData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [mode, setMode] = useState<FreightMode>("sea");
  const [withInsurance, setInsurance] = useState(true);
  const [result, setResult] = useState<CostBreakdown | null>(null);
  const [loading, setLoading] = useState(false);

  // AI Assistant filling states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSuccess, setAiSuccess] = useState<string | boolean>("");
  const [uncoveredFields, setUncoveredFields] = useState<string[]>([]);

  const getHighlightStyle = (field: string, extraStyles = {}) => {
    const isUncovered = uncoveredFields.includes(field);
    return {
      borderColor: isUncovered ? '#F59E0B' : '',
      boxShadow: isUncovered ? '0 0 0 3px rgba(245, 158, 11, 0.2)' : '',
      transition: 'all 0.3s ease',
      ...extraStyles
    };
  };
  const [geminiAvailable, setGeminiAvailable] = useState<boolean | null>(null);

  // Fetch status on mount
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : 'http://localhost:5000';
    fetch(`${baseUrl}/api/assistant/status`)
      .then(res => res.json())
      .then(data => setGeminiAvailable(data.geminiAvailable))
      .catch(err => {
        console.error('Failed to fetch assistant status:', err);
        setGeminiAvailable(false);
      });
  }, []);

  const handleAiQuickFill = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim() || aiLoading) return;

    setAiLoading(true);
    setAiError('');
    setAiSuccess(false);

    try {
      // 1. Fetch parser response
      const baseUrl = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : 'http://localhost:5000';
      const parseRes = await fetch(`${baseUrl}/api/assistant/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: promptToUse })
      });

      if (!parseRes.ok) throw new Error('AI parser request failed');
      const parsed = await parseRes.json();

      // 2. Lookup parsed product code semantically
      const searchRes = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(parsed.product)}`);
      if (!searchRes.ok) throw new Error('Product search request failed');
      const searchData = await searchRes.json();

      const searchResults = searchData.results || [];
      let activeHS = null;

      if (searchResults.length > 0) {
        activeHS = searchResults[0];
        setSelectedHS(activeHS);
        setSearchQuery(activeHS.productName);
      } else {
        const fallbackOption = {
          hsn4Digit: 'GENERIC',
          hsn8Digit: 'GENERIC',
          productName: parsed.product,
          gstRate: '5.0'
        };
        setSelectedHS(fallbackOption);
        setSearchQuery(parsed.product);
      }

      // Update forms and detect uncovered fields
      const newWeight = parsed.weight ? parsed.weight.toString() : "";
      const newQuantity = parsed.quantity ? parsed.quantity.toString() : quantity;
      const newProductValue = parsed.productValue ? parsed.productValue.toString() : "";
      const newMode = (parsed.mode && (parsed.mode === 'air' || parsed.mode === 'sea' || parsed.mode === 'road')) ? (parsed.mode as FreightMode) : mode;
      const newDestination = (parsed.destination && COUNTRIES.includes(parsed.destination)) ? parsed.destination : destination;
      const newOrigin = (parsed.origin && COUNTRIES.includes(parsed.origin)) ? parsed.origin : origin;

      const uncovered: string[] = [];

      if (!parsed.productValue) {
        uncovered.push('productValue');
        setProductValue("");
      } else {
        setProductValue(newProductValue);
      }

      if (!parsed.weight) {
        uncovered.push('weight');
        setWeight("");
      } else {
        setWeight(newWeight);
      }

      if (!parsed.origin) {
        uncovered.push('origin');
      } else {
        setOrigin(newOrigin);
      }

      if (!parsed.destination) {
        uncovered.push('destination');
      } else {
        setDestination(newDestination);
      }

      if (!parsed.mode || parsed.mode === 'null') {
        uncovered.push('mode');
      } else {
        setMode(newMode);
      }

      setQuantity(newQuantity);
      setUncoveredFields(uncovered);

      // Run calculation automatically
      if (activeHS) {
        const pv = parseFloat(parsed.productValue ? newProductValue : "0") || 0;
        const wt = parseFloat(parsed.weight ? newWeight : "0") || 0;
        const r = FREIGHT_RATES[newMode];

        const freightCost = Math.max(r.minUSD, wt * r.ratePerKg);
        const insuranceCost = withInsurance ? pv * 0.012 : 0;
        const cif = pv + freightCost + insuranceCost;

        const chapterPrefix = activeHS.hsn4Digit?.substring(0, 2) || "00";
        const dutyPct = GLOBAL_DUTY_ESTIMATES[chapterPrefix] ?? 5.0;
        const importDuty = cif * (dutyPct / 100);

        let destinationTaxPct = 0;
        if (newDestination === "India" && activeHS.gstRate) {
          const cleanDbString = activeHS.gstRate.toString().replace(/[^0-9.]/g, '');
          destinationTaxPct = parseFloat(cleanDbString) || 0;
        } else {
          destinationTaxPct = VAT_RATES[newDestination] ?? 0;
        }

        const vat = (cif + importDuty) * (destinationTaxPct / 100);
        const brokerageFee = 180 + (cif * 0.003);
        const total = cif + importDuty + vat + brokerageFee;

        setResult({
          productValue: pv,
          freightCost,
          insuranceCost,
          cif,
          importDuty,
          vat,
          brokerageFee,
          total,
        });
      }

      const engine = parsed.isFallback ? 'Local Fallback' : 'Gemini AI';
      setAiSuccess(engine);

    } catch (err) {
      console.error(err);
      setAiError('Assistant failed to process query. Try standard entries.');
    } finally {
      setAiLoading(false);
    }
  };

  // Auto-fill and calculate from homepage AI Assistant prompt
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrompt = localStorage.getItem('lastAiLogisticsPrompt');
      if (savedPrompt) {
        setAiPrompt(savedPrompt);
        localStorage.removeItem('lastAiLogisticsPrompt'); // Consume prompt so it doesn't loop
        setTimeout(() => {
          handleAiQuickFill(undefined, savedPrompt);
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    // Triggers instantly from the very first letter
    if (searchQuery.trim().length === 0) return;

    // Avoid triggering a new search and reopening the dropdown if the user just selected this item
    if (selectedHS && searchQuery === selectedHS.productName) {
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const baseUrl = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(searchQuery)}`);

        if (!res.ok) throw new Error("Search failed");

        const data = await res.json();
        const results = data.results || [];
        setHsOptions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        console.error(err);
        setHsOptions([]);
        setIsOpen(false);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce to prevent database spam

    return () => clearTimeout(timer);
  }, [searchQuery]);

  function calculate() {
    if (!selectedHS) {
      alert("Please search and select a product from the list first.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const pv = parseFloat(productValue) || 0;
      const wt = parseFloat(weight) || 0;
      const r = FREIGHT_RATES[mode];

      // 1. Calculate CIF (Cost, Insurance, Freight)
      const freightCost = Math.max(r.minUSD, wt * r.ratePerKg);
      // Industry standard default marine insurance is often calculated at 0.5% to 1.5% of FOB
      const insuranceCost = withInsurance ? pv * 0.012 : 0; 
      const cif = pv + freightCost + insuranceCost;

      // 2. Calculate Import Duty (Based on CIF)
      const chapterPrefix = selectedHS.hsn4Digit?.substring(0, 2) || "00";
      const dutyPct = GLOBAL_DUTY_ESTIMATES[chapterPrefix] ?? 5.0; // 5% global average fallback
      const importDuty = cif * (dutyPct / 100);

      // 3. Calculate VAT / GST (Based on CIF + Duty)
      let destinationTaxPct = 0;
      
      // If the destination is India (or you want to strictly use your DB for taxes everywhere):
      if (destination === "India" && selectedHS.gstRate) {
        // Safely strip out '%' or any text from the MongoDB string
        const cleanDbString = selectedHS.gstRate.toString().replace(/[^0-9.]/g, '');
        destinationTaxPct = parseFloat(cleanDbString) || 0;
      } else {
        // Fallback to standard global VAT tables for other countries
        destinationTaxPct = VAT_RATES[destination] ?? 0;
      }

      const vat = (cif + importDuty) * (destinationTaxPct / 100);

      // 4. Commercial Fees & Totals
      const brokerageFee = 180 + (cif * 0.003); // Flat fee + small % disbursement
      const total = cif + importDuty + vat + brokerageFee;

      setResult({
        productValue: pv,
        freightCost,
        insuranceCost,
        cif,
        importDuty,
        vat,
        brokerageFee,
        total,
      });
      setLoading(false);
    }, 400);
  }

  function reset() {
    setResult(null);
    setSearchQuery("");
    setSelectedHS(null);
    setHsOptions([]);
    setIsOpen(false);
  }

  const qty = parseFloat(quantity) || 1;
  const modeData = FREIGHT_RATES[mode];
  const activeDutyRate = selectedHS ? (GLOBAL_DUTY_ESTIMATES[selectedHS.hsn4Digit?.substring(0, 2)] ?? 5.0) : 0;

  return (
    <div style={{ background: "var(--bg)", minHeight: "80vh" }}>
      <div className="page-header">
        <div className="container">
          <div className="animate-fadeUp"><div className="label">Cost Estimator</div></div>
          <h1 className="animate-fadeUp delay-1" style={{ marginBottom: "0.875rem" }}>Landed Cost Calculator</h1>
          <p className="animate-fadeUp delay-2" style={{ maxWidth: 520, fontSize: "1.0625rem" }}>
            Estimate import duties, VAT, freight, insurance, and brokerage.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem", alignItems: "start" }}>
          
          <div className="card">
            {/* AI Assistant Quick Fill Panel */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 20px rgba(13,27,42,0.15)',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.625rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} color="#60a5fa" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#93c5fd' }}>
                    AI Quick Fill
                  </span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.75rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.06)',
                  padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <span style={{
                    display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                    background: geminiAvailable === null ? '#94a3b8' : (geminiAvailable ? '#10b981' : '#f59e0b'),
                    transition: 'background 0.3s'
                  }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {geminiAvailable === null ? 'Checking Status...' : (geminiAvailable ? 'Gemini AI' : 'Local Fallback')}
                  </span>
                </div>
              </div>
              <form onSubmit={handleAiQuickFill} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. export leather wallets from India to Germany 75kg"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius)',
                    padding: '0.5rem 0.75rem',
                    color: '#fff',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
                <button
                  type="submit"
                  disabled={aiLoading || !aiPrompt.trim()}
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    opacity: aiPrompt.trim() ? 1 : 0.6,
                  }}
                >
                  {aiLoading ? 'Filing...' : 'Apply'}
                </button>
              </form>
              {aiError && (
                <div style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 500 }}>
                  ⚠️ {aiError}
                </div>
              )}
              {aiSuccess && (
                <div style={{ color: '#86efac', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600 }}>
                  ✨ Fields successfully pre-filled & calculated via {aiSuccess}!
                </div>
              )}
              {aiSuccess && uncoveredFields.length > 0 && (
                <div style={{ 
                  background: 'rgba(245, 158, 11, 0.15)', 
                  border: '1px solid rgba(245, 158, 11, 0.3)', 
                  borderRadius: 'var(--radius)', 
                  padding: '0.625rem 0.875rem', 
                  marginTop: '0.75rem', 
                  color: '#FDE68A',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  lineHeight: '1.4'
                }}>
                  <AlertCircle size={14} style={{ color: '#F59E0B', flexShrink: 0 }} />
                  <div>
                    <strong>Missing details:</strong> Some fields weren't found in your prompt. We highlighted them in orange for you to fill manually.
                  </div>
                </div>
              )}
            </div>

            <h2 style={{ fontSize: "1.0625rem", marginBottom: "1.75rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
              Shipment Details
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* ── Live Search ── */}
              <div style={{ position: "relative" }}>
                <label>Search Product</label>
                <div style={{ position: "relative", display: "flex", gap: "0.5rem" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                    <input
                      className="input"
                      placeholder="Search by product name (e.g. potato, ceramic)..."
                      value={searchQuery}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchQuery(value);
                        if (selectedHS) setSelectedHS(null);

                        if (!value.trim()) {
                          setHsOptions([]);
                          setIsOpen(false);
                        }
                      }}
                      style={{ paddingLeft: "2.5rem", width: "100%" }}
                    />
                    {isSearching && <Loader2 size={14} className="animate-spin" style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />}
                  </div>
                </div>

                {isOpen && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", marginTop: "0.25rem", maxHeight: 250, overflowY: "auto", zIndex: 100, boxShadow: "var(--shadow-md)" }}>
                    {hsOptions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedHS(item);
                          setSearchQuery(item.productName);
                          setHsOptions([]);
                          setIsOpen(false);
                        }}
                        style={{ padding: "0.75rem 1rem", cursor: "pointer", borderBottom: idx !== hsOptions.length - 1 ? "1px solid var(--border)" : "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <div style={{ fontWeight: 600, color: "var(--navy)" }}>{item.productName}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>HS Code: {item.hsn8Digit || item.hsn4Digit}</div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedHS && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--accent)" }}>
                    Selected: <strong>{selectedHS.hsn8Digit || selectedHS.hsn4Digit}</strong> • Duty Est: <strong>{activeDutyRate}%</strong>
                  </div>
                )}
              </div>

              {/* Product value */}
              <div>
                <label>Product Value (USD)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontWeight: 700 }}>$</span>
                  <input 
                    className="input" 
                    type="number" 
                    min="0" 
                    value={productValue} 
                    onChange={(e) => {
                      setProductValue(e.target.value);
                      setUncoveredFields(prev => prev.filter(f => f !== 'productValue'));
                    }} 
                    style={getHighlightStyle('productValue', { paddingLeft: "1.875rem" })} 
                  />
                </div>
              </div>

              {/* Weight & Quantity */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div>
                  <label>Gross Weight (kg)</label>
                  <input 
                    className="input" 
                    type="number" 
                    min="0" 
                    value={weight} 
                    onChange={(e) => {
                      setWeight(e.target.value);
                      setUncoveredFields(prev => prev.filter(f => f !== 'weight'));
                    }} 
                    style={getHighlightStyle('weight')} 
                  />
                </div>
                <div>
                  <label>Quantity (units)</label>
                  <input 
                    className="input" 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={(e) => {
                      setQuantity(e.target.value);
                      setUncoveredFields(prev => prev.filter(f => f !== 'quantity'));
                    }} 
                    style={getHighlightStyle('quantity')} 
                  />
                </div>
              </div>

              {/* Origin / Destination */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div>
                  <label>Origin</label>
                  <select 
                    className="input select" 
                    value={origin} 
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      setUncoveredFields(prev => prev.filter(f => f !== 'origin'));
                    }}
                    style={getHighlightStyle('origin')}
                  >
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Destination</label>
                  <select 
                    className="input select" 
                    value={destination} 
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setUncoveredFields(prev => prev.filter(f => f !== 'destination'));
                    }}
                    style={getHighlightStyle('destination')}
                  >
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Freight mode */}
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Freight Mode</span>
                  {uncoveredFields.includes('mode') && (
                    <span style={{ color: '#D97706', fontSize: '0.75rem', fontWeight: 600 }}>Please select</span>
                  )}
                </label>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(3,1fr)", 
                  gap: "0.625rem",
                  padding: uncoveredFields.includes('mode') ? '4px' : '0',
                  border: uncoveredFields.includes('mode') ? '1.5px solid #F59E0B' : '1.5px solid transparent',
                  borderRadius: 'var(--radius)',
                  boxShadow: uncoveredFields.includes('mode') ? '0 0 0 3px rgba(245, 158, 11, 0.2)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {(Object.entries(FREIGHT_RATES) as [FreightMode, (typeof FREIGHT_RATES)["air"]][]).map(([key, { label, icon: Icon, color, bg }]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setMode(key);
                        setUncoveredFields(prev => prev.filter(f => f !== 'mode'));
                      }}
                      style={{
                        padding: "0.875rem 0.5rem", borderRadius: "var(--radius)",
                        border: `1.5px solid ${mode === key ? color : "var(--border)"}`,
                        background: mode === key ? bg : "var(--surface)", cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
                        color: mode === key ? color : "var(--muted)", fontWeight: 600, fontSize: "0.8rem",
                        boxShadow: mode === key ? `0 3px 12px ${color}20` : "none",
                      }}
                    >
                      <Icon size={18} /> {label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insurance toggle */}
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontWeight: 400, fontSize: "0.875rem", padding: "0.75rem 1rem", background: withInsurance ? "var(--accent-bg)" : "var(--bg)", border: `1.5px solid ${withInsurance ? "var(--accent-border)" : "var(--border)"}`, borderRadius: "var(--radius)" }}>
                <input type="checkbox" checked={withInsurance} onChange={(e) => setInsurance(e.target.checked)} style={{ width: 17, height: 17, accentColor: "var(--accent)", cursor: "pointer" }} />
                Include cargo insurance (1.2% of CIF)
              </label>

              <button onClick={calculate} className="btn btn-blue" style={{ justifyContent: "center", padding: "0.9375rem" }} disabled={loading}>
                {loading ? "Calculating…" : <><Calculator size={16} /> Calculate Landed Cost</>}
              </button>
            </div>
          </div>

          {/* ── Results Panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {!result ? (
              <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--bg)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <Calculator size={30} color="var(--muted)" style={{ opacity: 0.4 }} />
                </div>
                <p style={{ margin: 0, fontWeight: 500, color: "var(--navy)" }}>Ready to calculate?</p>
                <p style={{ margin: "0.375rem 0 0", fontSize: "0.875rem" }}>Search for a product, fill in the form, and hit calculate.</p>
              </div>
            ) : (
              <>
                <div style={{ background: "var(--gradient-hero)", borderRadius: "var(--radius-xl)", padding: "2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem", position: "relative" }}>Total Landed Cost</div>
                  <div style={{ fontSize: "3rem", fontWeight: 800, color: "#fff", lineHeight: 1, position: "relative", letterSpacing: "-0.04em" }}>${fmt(result.total)}</div>
                  <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)", marginTop: "0.625rem", position: "relative" }}>{origin} → {destination} · {modeData.label}</div>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: "0.9375rem", marginBottom: "1.25rem" }}>Cost Breakdown</h3>
                  {[
                    { label: "Product Value (FOB)", value: result.productValue, color: "var(--navy)" },
                    { label: `Freight (${modeData.label})`, value: result.freightCost, color: modeData.color },
                    ...(withInsurance ? [{ label: "Cargo Insurance (1.2%)", value: result.insuranceCost, color: "var(--navy)" }] : []),
                    { label: "CIF Value", value: result.cif, color: "var(--navy)", divider: true },
                    { label: `Import Duty (${activeDutyRate}%)`, value: result.importDuty, color: "#DC2626" },
                    { label: `VAT / GST (${VAT_RATES[destination] ?? 0}%)`, value: result.vat, color: "#7C3AED" },
                    { label: "Customs Brokerage (est.)", value: result.brokerageFee, color: "var(--navy)" },
                  ].map(({ label, value, divider, color }: any) => (
                    <div key={label}>
                      {divider && <div className="divider" style={{ margin: "0.75rem 0" }} />}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: divider ? "none" : "1px solid var(--border)" }}>
                        <span style={{ fontSize: "0.875rem", color: divider ? "var(--navy)" : "var(--muted)", fontWeight: divider ? 600 : 400 }}>{label}</span>
                        <span style={{ fontWeight: divider ? 800 : 600, fontSize: "0.9rem", color: divider ? "var(--navy)" : color }}>${fmt(value)}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", marginTop: "0.25rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: "1.375rem", color: "var(--accent)" }}>${fmt(result.total)}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xs)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Cost Per Unit</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>{quantity} units total</div>
                  </div>
                  <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--navy)", letterSpacing: "-0.04em" }}>${fmt(result.total / qty)}</div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={reset} className="btn btn-outline" style={{ flex: 1 }}><RefreshCw size={14} /> Reset</button>
                  <Link href="/contact" className="btn btn-amber" style={{ flex: 1, justifyContent: "center" }}>Get Official Quote <ArrowRight size={14} /></Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
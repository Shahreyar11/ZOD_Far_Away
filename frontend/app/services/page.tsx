import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Plane, Ship, Truck, Warehouse, Shield, BarChart3,
  CheckCircle2, ArrowRight, Clock, Globe, Package2, ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Services' };

const services = [
  {
    icon: Plane,
    title: 'Air Freight',
    subtitle: 'Fast & Reliable',
    color: '#00B4D8',
    desc: 'Express delivery for time-sensitive cargo worldwide. Direct and consolidated air cargo solutions with major carriers.',
    features: [
      'Door-to-door in 1–5 business days',
      'Real-time tracking & alerts',
      'Dangerous goods handling (IATA certified)',
      'Express customs clearance',
      'Temperature-controlled options',
    ],
    transit: '1–5 days',
    ideal: 'High-value, urgent, or perishable goods',
  },
  {
    icon: Ship,
    title: 'Sea Freight',
    subtitle: 'Cost-Effective Global Shipping',
    color: '#0D1B2A',
    desc: 'Full Container Load (FCL) and Less than Container Load (LCL) solutions for large cargo across all major trade lanes.',
    features: [
      'FCL and LCL options',
      'Reefer and hazmat containers',
      'Port-to-port and door-to-door',
      'Weekly sailings on major lanes',
      'Roll-on/Roll-off for vehicles',
    ],
    transit: '15–45 days',
    ideal: 'Large volumes, bulk goods, heavy machinery',
  },
  {
    icon: Truck,
    title: 'Road Freight',
    subtitle: 'Cross-Border Land Transport',
    color: '#F4A261',
    desc: 'Full Truck Load (FTL) and Less than Truck Load (LTL) across Europe, Middle East, Central Asia, and beyond.',
    features: [
      'FTL and LTL options',
      'Customs & cross-border expertise',
      'GPS-tracked fleet',
      'Refrigerated transport available',
      'Overnight and express services',
    ],
    transit: '3–10 days',
    ideal: 'Regional shipments, cross-border trade',
  },
  {
    icon: Warehouse,
    title: 'Warehousing & Distribution',
    subtitle: 'Storage & Fulfilment',
    color: '#A78BFA',
    desc: 'Strategically located warehouses in key trade hubs. Bonded and non-bonded storage with pick-and-pack and B2C fulfilment.',
    features: [
      'Bonded warehousing (duty deferred)',
      'Pick, pack & dispatch',
      'Inventory management system',
      'B2B and B2C fulfilment',
      'Hazmat & controlled goods storage',
    ],
    transit: 'On-demand',
    ideal: 'E-commerce, retail, distribution hubs',
  },
  {
    icon: Shield,
    title: 'Customs Brokerage',
    subtitle: 'Seamless Clearance',
    color: '#22C55E',
    desc: 'Licensed customs brokers handling import/export declarations, duty payments, and regulatory compliance in 50+ countries.',
    features: [
      'Licensed customs brokers',
      'HS code classification',
      'Duty & tax calculation',
      'Permits and licenses',
      'Drawback and duty relief',
    ],
    transit: '1–3 days',
    ideal: 'All importers and exporters',
  },
  {
    icon: BarChart3,
    title: 'Supply Chain Consulting',
    subtitle: 'Expert Advisory',
    color: '#F43F5E',
    desc: 'End-to-end supply chain design, trade compliance audits, cost reduction programmes, and digital transformation consulting.',
    features: [
      'Trade compliance audit',
      'Landed cost optimisation',
      'Incoterms strategy review',
      'Supplier vetting & onboarding',
      'Digital supply chain roadmap',
    ],
    transit: 'Project-based',
    ideal: 'Growing importers, complex supply chains',
  },
];

const processSteps = [
  { step: '01', title: 'Request a Quote', desc: 'Fill in your shipment details and get a tailored quote within 2 hours.' },
  { step: '02', title: 'Confirm & Book', desc: 'Approve the quote, sign the service agreement, and we handle the rest.' },
  { step: '03', title: 'We Arrange Everything', desc: 'Freight booking, documentation, customs filing — all managed by us.' },
  { step: '04', title: 'Track & Receive', desc: 'Real-time updates until your cargo is delivered and signed off.' },
];

export default function ServicesPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <div className="section-label"><Package2 size={14} /> Our Services</div>
          <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>
            End-to-End <span className="text-gradient">Logistics Services</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 560, lineHeight: 1.7, fontSize: '1.0625rem' }}>
            Everything you need to move goods across borders — under one roof, with one point of contact.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <section className="section">
        <div className="container">
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {services.map(({ icon: Icon, title, subtitle, color, desc, features, transit, ideal }) => (
              <div key={title} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={24} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.0625rem', color: 'var(--navy)', marginBottom: '0.125rem' }}>{title}</h3>
                    <div style={{ fontSize: '0.8rem', color, fontWeight: 600 }}>{subtitle}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', flex: 1 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={14} color="#22C55E" style={{ marginTop: 3, flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Transit</div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{transit}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Ideal For</div>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: color, maxWidth: 200, textAlign: 'right' }}>{ideal}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><Clock size={14} /> How It Works</div>
            <h2>Simple <span className="text-gradient">4-Step Process</span></h2>
          </div>
          <div className="grid-4">
            {processSteps.map(({ step, title, desc }, i) => (
              <div key={step} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--teal-dark), var(--teal))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  fontWeight: 800, fontSize: '1.125rem', color: '#fff',
                  boxShadow: '0 8px 24px rgba(0,180,216,0.3)',
                }}>
                  {step}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Ready to Ship?</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Get a tailored logistics quote from our team within 2 hours.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-amber" style={{ padding: '0.875rem 2rem' }}>
              Get a Free Quote <ArrowRight size={16} />
            </Link>
            <Link href="/cost-calculator" className="btn btn-ghost" style={{ padding: '0.875rem 2rem' }}>
              Estimate Costs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

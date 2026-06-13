import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Search, Globe, Calculator, Truck, ChevronRight, TrendingUp, Shield, Clock, Route } from 'lucide-react';
import HSSearchBar from '../components/HSSearchBar';

export const metadata: Metadata = {
  title: 'ZODFarAway — Global Logistics & Supply Chain',
  description: 'HS code lookup, landed cost calculator, supply chain planner and freight services — all in one platform.',
};

const STATS = [
  { value: '150+', label: 'Countries covered', icon: Globe },
  { value: '50K+', label: 'Shipments / month', icon: TrendingUp },
  { value: '99.2%', label: 'On-time delivery', icon: Clock },
  { value: '$2B+', label: 'Trade value handled', icon: Shield },
];

const FEATURES = [
  {
    icon: Search,
    title: 'HS Code Search',
    desc: 'Classify any product instantly. Get duty rates, required documents, and VAT for any trade lane.',
    href: '/hs-codes',
    color: '#0066FF',
    bg: '#EBF2FF',
  },
  {
    icon: Globe,
    title: 'Supply Chain Planner',
    desc: 'Visualise every stage from sourcing to delivery — with timelines, risks, and required documents.',
    href: '/supply-chain',
    color: '#0D9488',
    bg: '#EDFAF9',
  },
  {
    icon: Calculator,
    title: 'Landed Cost Calculator',
    desc: 'Calculate duties, VAT, freight, insurance, and brokerage for any country pair in seconds.',
    href: '/cost-calculator',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: Route,
    title: 'Route Optimizer',
    desc: 'Traffic-aware routing via OSRM/OpenRouteService plus live road, port, air cargo, and border congestion checks.',
    href: '/route-optimization',
    color: '#DC2626',
    bg: '#FEF2F2',
  },
  {
    icon: Truck,
    title: 'Freight Estimation',
    desc: 'Calculate precise freight costs using our live fuel and distance multipliers.',
    href: '/services',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
];

const STEPS = [
  { num: '01', title: 'Classify your product', desc: 'Find the right HS code instantly with our smart search.' },
  { num: '02', title: 'Calculate landed cost', desc: 'Duties, VAT, freight — all upfront, zero surprises.' },
  { num: '03', title: 'Book freight', desc: 'Choose mode, confirm, and we handle the rest.' },
  { num: '04', title: 'Track to your door', desc: 'Real-time updates from port to final delivery.' },
];

const PARTNERS = ['DHL', 'Maersk', 'FedEx', 'MSC', 'Flexport'];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--gradient-hero)',
        padding: '6rem 0 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute', top: '15%', left: '5%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '8%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ maxWidth: 820, textAlign: 'center', position: 'relative' }}>

          {/* Eyebrow badge */}
          <div className="animate-fadeUp" style={{ marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.9)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.35rem 1rem',
              fontSize: '0.8rem', fontWeight: 600,
              backdropFilter: 'blur(8px)',
            }}>
              🌐 &nbsp;Trusted by 10,000+ businesses in 150+ countries
            </span>
          </div>

          <h1 className="animate-fadeUp delay-1" style={{ color: '#fff', marginBottom: '1.375rem' }}>
            Global Logistics,<br />
            <span className="text-gradient">Made Simple</span>
          </h1>

          <p className="animate-fadeUp delay-2" style={{
            fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)',
            maxWidth: 540, margin: '0 auto 2.5rem', lineHeight: 1.7,
          }}>
            From HS code classification to last-mile delivery — calculate duties, compare freight, and manage your entire supply chain in one place.
          </p>

          <div className="animate-fadeUp delay-3" style={{ position: 'relative', zIndex: 50 }}>
            <HSSearchBar />
          </div>

          <div className="animate-fadeUp delay-4" style={{
            display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem',
          }}>
            <Link href="/cost-calculator" className="btn btn-white btn-lg">
              Calculate Costs <ArrowRight size={16} />
            </Link>
            <Link href="/hs-codes" className="btn btn-lg" style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
            }}>
              Search HS Codes
            </Link>
          </div>

          {/* Trusted-by strip */}
          <div className="animate-fadeUp delay-4" style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Partners</span>
            {PARTNERS.map(b => (
              <span key={b} style={{
                fontSize: '0.8125rem', fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                padding: '0.25rem 0.875rem',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(255,255,255,0.05)',
              }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 0,
          }}>
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <div key={label} className="stat-item" style={{
                borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', marginBottom: '0.375rem',
                }}>
                  <Icon size={16} color="var(--accent)" />
                </div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <div className="label" style={{ margin: '0 auto 1rem' }}>Platform</div>
            <h2 style={{ marginBottom: '0.75rem' }}>Everything in one place</h2>
            <p style={{ maxWidth: 440, margin: '0 auto', fontSize: '1rem' }}>
              Powerful tools for every step of your international trade journey.
            </p>
          </div>

          <div className="grid-2">
            {FEATURES.map(({ icon: Icon, title, desc, href, color, bg }) => (
              <Link key={title} href={href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: 'var(--radius-lg)',
                    background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: `1px solid ${color}22`,
                  }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ marginBottom: '0.625rem' }}>{title}</h3>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1.375rem' }}>{desc}</p>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    fontSize: '0.8125rem', fontWeight: 700, color,
                  }}>
                    Explore <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <div className="label" style={{ margin: '0 auto 1rem' }}>How it works</div>
            <h2>Ship in 4 simple steps</h2>
          </div>

          <div className="grid-4">
            {STEPS.map(({ num, title, desc }, i) => (
              <div key={num} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                {/* Connector line visual */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <div className="step-num" style={{ width: 48, height: 48, fontSize: '0.875rem' }}>{num}</div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 'calc(50% + 28px)', top: '50%',
                      width: 'calc(100% - 24px)', height: 1,
                      background: 'linear-gradient(90deg, var(--accent-border), transparent)',
                      pointerEvents: 'none',
                    }} className="desktop-only" />
                  )}
                </div>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9375rem' }}>{title}</h4>
                <p style={{ fontSize: '0.85rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Banner ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-bg) 0%, #F0FDFC 100%)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}>
            {[
              { icon: Shield, title: 'ISO 9001 Certified', desc: 'Quality management you can trust' },
              { icon: Clock, title: '2-Hour Response', desc: 'Our team responds fast, always' },
              { icon: Globe, title: 'AEO Status', desc: 'Authorised Economic Operator approved' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius)',
                  background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)', marginBottom: '0.2rem' }}>{title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--gradient-hero)', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,102,255,0.2) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(245,158,11,0.2)',
              border: '1px solid rgba(245,158,11,0.4)',
              color: '#FCD34D',
              borderRadius: 'var(--radius-pill)',
              padding: '0.25rem 0.875rem',
              fontSize: '0.75rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>Limited offer</span>
          </div>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Ready to ship smarter?</h2>
          <p style={{ marginBottom: '2.5rem', maxWidth: 400, margin: '0 auto 2.5rem', color: 'rgba(255,255,255,0.65)', fontSize: '1rem' }}>
            Get a personalised quote from our team within 2 hours — free of charge.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-amber btn-lg">
              Get a Free Quote <ArrowRight size={16} />
            </Link>
            <Link href="/services" className="btn btn-lg" style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.85)',
            }}>
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Package2,
  Globe,
  Calculator,
  Truck,
  Shield,
  Clock,
  BarChart3,
  Search,
  ChevronRight,
  Star,
  CheckCircle2,
  TrendingUp,
  Box,
  Plane,
  Ship,
  Warehouse,
} from 'lucide-react';

const stats = [
  { value: '150+', label: 'Countries Served', icon: Globe },
  { value: '50K+', label: 'Shipments/Month', icon: Package2 },
  { value: '99.2%', label: 'On-Time Delivery', icon: Clock },
  { value: '$2B+', label: 'Trade Value Handled', icon: TrendingUp },
];

const features = [
  {
    icon: Search,
    title: 'HS Code Explorer',
    desc: 'Instantly search and classify any product with the correct Harmonized System code. Covers all chapters and subheadings.',
    href: '/hs-codes',
    color: '#00B4D8',
  },
  {
    icon: Globe,
    title: 'Supply Chain Planner',
    desc: 'Map your full journey — from sourcing to last-mile delivery — with timelines, milestones, and risk indicators.',
    href: '/supply-chain',
    color: '#F4A261',
  },
  {
    icon: Calculator,
    title: 'Cost & Duty Calculator',
    desc: 'Calculate import duties, VAT, freight costs, insurance, and landing costs for any country pair in seconds.',
    href: '/cost-calculator',
    color: '#22C55E',
  },
  {
    icon: Truck,
    title: 'Freight Services',
    desc: 'Air, sea, road, and rail freight options with live rate comparison, booking, and real-time tracking.',
    href: '/services',
    color: '#A78BFA',
  },
];

const steps = [
  { num: '01', title: 'Product & HS Code', desc: 'Classify your goods correctly to determine applicable duties and regulations.', icon: Search },
  { num: '02', title: 'Origin & Compliance', desc: 'Verify export controls, certificates of origin, and trade agreement eligibility.', icon: Shield },
  { num: '03', title: 'Freight & Insurance', desc: 'Choose your shipping mode, get quotes, and arrange cargo insurance.', icon: Ship },
  { num: '04', title: 'Customs Clearance', desc: 'We handle documentation, duty payment, and regulatory compliance at borders.', icon: Package2 },
  { num: '05', title: 'Last-Mile Delivery', desc: 'Track your shipment to the final destination with real-time updates.', icon: Truck },
];

const freightTypes = [
  { icon: Plane, label: 'Air Freight', time: '1–5 days', tag: 'Express' },
  { icon: Ship, label: 'Sea Freight', time: '15–45 days', tag: 'Economy' },
  { icon: Truck, label: 'Road Freight', time: '3–10 days', tag: 'Regional' },
  { icon: Warehouse, label: 'Warehousing', time: 'On-demand', tag: 'Storage' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Import Manager, TechGoods Asia',
    text: 'ZODFarAway reduced our customs clearance time by 60%. The HS code tool alone saved us thousands in misclassification penalties.',
    stars: 5,
  },
  {
    name: 'Ahmed Al-Rashid',
    role: 'CEO, Gulf Trade Co.',
    text: 'The cost calculator is incredibly accurate. We now plan our landed costs with confidence before every shipment.',
    stars: 5,
  },
  {
    name: 'Maria Santos',
    role: 'Logistics Director, BrazilExports Ltd',
    text: 'From HS code lookup to final delivery tracking — everything in one platform. Game-changer for our team.',
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1B2E45 55%, #0a3d62 100%)',
      }}>
        {/* Decorative blobs */}
        <div className="glow-blob" style={{ width: 500, height: 500, background: '#00B4D8', top: '-100px', right: '-100px' }} />
        <div className="glow-blob" style={{ width: 300, height: 300, background: '#F4A261', bottom: '0px', left: '-80px', opacity: 0.12 }} />

        {/* Animated globe-grid SVG */}
        <svg style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.06, animation: 'spin-slow 60s linear infinite' }}
          width="600" height="600" viewBox="0 0 600 600">
          <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="1" fill="none" />
          <ellipse cx="300" cy="300" rx="280" ry="120" stroke="white" strokeWidth="1" fill="none" />
          <ellipse cx="300" cy="300" rx="280" ry="200" stroke="white" strokeWidth="1" fill="none" />
          <line x1="20" y1="300" x2="580" y2="300" stroke="white" strokeWidth="1" />
          <line x1="300" y1="20" x2="300" y2="580" stroke="white" strokeWidth="1" />
          <line x1="80" y1="100" x2="520" y2="500" stroke="white" strokeWidth="0.5" />
          <line x1="520" y1="100" x2="80" y2="500" stroke="white" strokeWidth="0.5" />
        </svg>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '2rem', paddingBottom: '4rem' }}>
          {/* Badge */}
          <div className="animate-fadeUp" style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-teal" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
              🌐 &nbsp;Trusted by 10,000+ businesses in 150+ countries
            </span>
          </div>

          <h1 className="animate-fadeUp delay-100" style={{ color: '#fff', maxWidth: 720, marginBottom: '1.5rem' }}>
            Your Complete{' '}
            <span className="text-gradient">Global Logistics</span>{' '}
            Partner
          </h1>

          <p className="animate-fadeUp delay-200" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.65)', maxWidth: 560, marginBottom: '2.5rem', lineHeight: 1.8 }}>
            From HS code classification to last-mile delivery — calculate duties, plan supply chains, compare freight rates, and manage every step of your global shipment.
          </p>

          <div className="animate-fadeUp delay-300" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/cost-calculator" className="btn btn-amber" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Calculate Costs <ArrowRight size={18} />
            </Link>
            <Link href="/hs-codes" className="btn btn-ghost" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Search HS Codes
            </Link>
          </div>

          {/* Quick search bar */}
          <div className="animate-fadeUp delay-400" style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 16,
            overflow: 'hidden',
            maxWidth: 560,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1.25rem' }}>
              <Search size={18} color="rgba(255,255,255,0.4)" />
            </div>
            <input
              type="text"
              placeholder="Search HS code or product name…"
              style={{
                flex: 1,
                padding: '1rem 1rem',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.9375rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
            />
            <Link href="/hs-codes" className="btn btn-primary" style={{ borderRadius: 0, padding: '0 1.5rem', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
              Search
            </Link>
          </div>

          {/* Trusted logos row */}
          <div className="animate-fadeUp delay-500" style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trusted by</span>
            {['DHL', 'Maersk', 'FedEx', 'MSC', 'Kuehne+Nagel'].map(b => (
              <span key={b} style={{
                fontSize: '0.875rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)',
                padding: '0.375rem 0.875rem',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
              }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(0,180,216,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color="#00B4D8" />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <BarChart3 size={14} /> Our Platform
            </div>
            <h2>Everything You Need in <span className="text-gradient">One Place</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: 520, margin: '1rem auto 0' }}>
              Powerful tools that simplify global trade from classification to delivery.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {features.map(({ icon: Icon, title, desc, href, color }) => (
              <Link key={title} href={href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    <Icon size={24} color={color} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.625rem', color: 'var(--navy)' }}>{title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>{desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '1.25rem', color, fontWeight: 600, fontSize: '0.875rem' }}>
                    Explore <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Supply Chain Steps ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-blob" style={{ width: 400, height: 400, background: '#00B4D8', top: '50%', right: '-100px', transform: 'translateY(-50%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <Globe size={14} /> End-to-End Journey
            </div>
            <h2 style={{ color: '#fff' }}>From <span className="text-gradient-amber">Idea</span> to Doorstep</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: '1rem', maxWidth: 480, margin: '1rem auto 0' }}>
              We manage every stage of your supply chain so you can focus on your business.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {steps.map(({ num, title, desc, icon: Icon }, i) => (
              <div key={num} className="card-dark" style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: '1.5rem', right: '1.5rem',
                  fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)',
                  lineHeight: 1,
                }}>
                  {num}
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(0,180,216,0.15)',
                  border: '1px solid rgba(0,180,216,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  <Icon size={20} color="#00B4D8" />
                </div>
                <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/supply-chain" className="btn btn-primary">
              See Full Journey <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Freight Types ──────────────────────────────────────── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <Truck size={14} /> Freight Options
            </div>
            <h2>Ship <span className="text-gradient">Any Way</span> You Need</h2>
          </div>
          <div className="grid-4">
            {freightTypes.map(({ icon: Icon, label, time, tag }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: 'linear-gradient(135deg, rgba(0,180,216,0.1), rgba(0,180,216,0.05))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <Icon size={28} color="#00B4D8" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.375rem' }}>{label}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{time}</p>
                <span className="badge badge-teal">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <Star size={14} /> Testimonials
            </div>
            <h2>What Our <span className="text-gradient">Clients Say</span></h2>
          </div>
          <div className="grid-3">
            {testimonials.map(({ name, role, text, stars }) => (
              <div key={name} className="card">
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={16} color="#F4A261" fill="#F4A261" />
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  "{text}"
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--teal-dark) 0%, var(--teal) 100%)',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
        }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Ready to Simplify Your Supply Chain?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Get a personalised quote or talk to our logistics experts today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-amber" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Get Free Quote <ArrowRight size={18} />
            </Link>
            <Link href="/supply-chain" className="btn btn-ghost" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

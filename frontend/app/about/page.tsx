import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Globe, Users, Award, TrendingUp, Shield, Clock,
  MapPin, ArrowRight, CheckCircle2, Target, Zap, Heart,
} from 'lucide-react';

export const metadata: Metadata = { title: 'About Us' };

const stats = [
  { value: '2015', label: 'Founded', icon: Clock },
  { value: '150+', label: 'Countries', icon: Globe },
  { value: '400+', label: 'Team Members', icon: Users },
  { value: '99.2%', label: 'On-Time Rate', icon: TrendingUp },
];

const values = [
  { icon: Shield, color: '#00B4D8', title: 'Reliability', desc: 'We deliver on our promises — on time, every time. Our 99.2% on-time delivery record speaks for itself.' },
  { icon: Target, color: '#F4A261', title: 'Precision', desc: 'Accurate HS classification, duty calculation, and documentation — zero margin for costly errors.' },
  { icon: Zap, color: '#22C55E', title: 'Speed', desc: 'From quote to departure in hours. Our digital platform eliminates paperwork delays.' },
  { icon: Heart, color: '#A78BFA', title: 'Customer First', desc: 'A dedicated account manager and 24/7 support team for every client, big or small.' },
];

const team = [
  { name: 'Aisha Rahman', role: 'CEO & Co-Founder', location: 'Dubai, UAE', expertise: '20+ yrs in Freight' },
  { name: 'Marcus Wong', role: 'CTO', location: 'Singapore', expertise: 'Supply Chain Tech' },
  { name: 'Elena Petrov', role: 'Head of Customs', location: 'Rotterdam, NL', expertise: 'EU Trade Compliance' },
  { name: 'James Okonkwo', role: 'Director, Africa Ops', location: 'Lagos, NG', expertise: 'African Trade Routes' },
];

const offices = [
  { city: 'Dubai', country: 'UAE', type: 'HQ', flag: '🇦🇪' },
  { city: 'London', country: 'UK', type: 'Regional HQ', flag: '🇬🇧' },
  { city: 'Singapore', country: 'Singapore', type: 'Asia Pacific HQ', flag: '🇸🇬' },
  { city: 'New York', country: 'USA', type: 'Americas HQ', flag: '🇺🇸' },
  { city: 'Shanghai', country: 'China', type: 'Sourcing Hub', flag: '🇨🇳' },
  { city: 'Lagos', country: 'Nigeria', type: 'Africa Hub', flag: '🇳🇬' },
];

const certs = [
  'ISO 9001:2015 Quality Management',
  'AEO (Authorised Economic Operator)',
  'IATA Cargo Agent',
  'FIATA Member',
  'C-TPAT Certified (US)',
  'SOLAS Compliant',
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-blob" style={{ width: 400, height: 400, background: '#00B4D8', top: '-100px', right: '-80px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label"><Globe size={14} /> Our Story</div>
          <h1 style={{ color: '#fff', maxWidth: 700, marginBottom: '1.25rem' }}>
            Connecting the World, <span className="text-gradient">One Shipment</span> at a Time
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 580, lineHeight: 1.8, fontSize: '1.0625rem', marginBottom: '2.5rem' }}>
            Founded in 2015, ZODFarAway was built on a simple belief: international trade should be simple, transparent, and accessible to every business — not just the big players.
          </p>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#00B4D8', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div className="section-label"><Target size={14} /> Mission & Vision</div>
              <h2 style={{ marginBottom: '1.25rem' }}>
                Making Global Trade <span className="text-gradient">Frictionless</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                We built ZODFarAway because we saw how broken the logistics industry was — opaque pricing, buried paperwork, unexpected duty bills, and zero visibility. We set out to fix all of that.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.75rem' }}>
                Today, our platform and team help over 10,000 businesses across 150 countries ship confidently — with upfront costs, accurate HS classifications, and real-time tracking from day one.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Work With Us <ArrowRight size={16} />
              </Link>
            </div>

            {/* Certifications */}
            <div className="card" style={{ background: 'rgba(0,180,216,0.04)', border: '1px solid rgba(0,180,216,0.15)' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--navy)' }}>
                Certifications & Memberships
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {certs.map(c => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <Award size={16} color="#00B4D8" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><Heart size={14} /> Our Values</div>
            <h2>What Drives <span className="text-gradient">Everything We Do</span></h2>
          </div>
          <div className="grid-4">
            {values.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 18,
                  background: `${color}15`, margin: '0 auto 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={26} color={color} />
                </div>
                <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.625rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><Users size={14} /> Leadership</div>
            <h2>Meet Our <span className="text-gradient">Leadership Team</span></h2>
          </div>
          <div className="grid-4">
            {team.map(({ name, role, location, expertise }) => {
              const initials = name.split(' ').map(n => n[0]).join('');
              const colors = ['#00B4D8', '#F4A261', '#A78BFA', '#22C55E'];
              const color = colors[team.findIndex(t => t.name === name) % colors.length];
              return (
                <div key={name} className="card" style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                    border: `2px solid ${color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '1.5rem', fontWeight: 800, color,
                  }}>
                    {initials}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{name}</div>
                  <div style={{ fontSize: '0.8125rem', color, fontWeight: 600, marginBottom: '0.5rem' }}>{role}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                    <MapPin size={12} /> {location}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{expertise}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global offices */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><Globe size={14} /> Global Presence</div>
            <h2 style={{ color: '#fff' }}>Our <span className="text-gradient">Offices</span></h2>
          </div>
          <div className="grid-3">
            {offices.map(({ city, country, type, flag }) => (
              <div key={city} className="card-dark" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{flag}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#fff' }}>{city}, {country}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--teal)', fontWeight: 600 }}>{type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--teal-dark), var(--teal))', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Join 10,000+ Businesses That Trust Us</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Start shipping smarter today with ZODFarAway.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-amber" style={{ padding: '0.875rem 2rem' }}>
              Get Started <ArrowRight size={16} />
            </Link>
            <Link href="/services" className="btn btn-ghost" style={{ padding: '0.875rem 2rem' }}>
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

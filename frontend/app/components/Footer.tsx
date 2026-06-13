'use client';

import Link from 'next/link';
import { Package2, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const FOOTER_LINKS = {
  Tools: [
    { label: 'HS Code Search',        href: '/hs-codes' },
    { label: 'Cost Calculator',       href: '/cost-calculator' },
    { label: 'Supply Chain Planner',  href: '/supply-chain' },
  ],
  Services: [
    { label: 'Air Freight',           href: '/services' },
    { label: 'Sea Freight',           href: '/services' },
    { label: 'Customs Brokerage',     href: '/services' },
    { label: 'Warehousing',           href: '/services' },
  ],
  Company: [
    { label: 'About Us',  href: '/about' },
    { label: 'Contact',   href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--navy)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      marginTop: 'auto',
    }}>
      <div className="container" style={{ padding: '4rem 1.5rem 2rem' }}>

        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>

          {/* Brand column */}
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'var(--gradient-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(0,102,255,0.4)',
              }}>
                <Package2 size={17} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.035em', color: '#fff' }}>
                ZOD<span style={{ color: 'var(--accent-light)' }}>Far</span>Away
              </span>
            </Link>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.7, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.45)' }}>
              End-to-end supply chain solutions — from HS classification to last-mile delivery.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { icon: Phone, text: '+1 (800) ZOD-SHIP' },
                { icon: Mail,  text: 'hello@zodfaraway.com' },
                { icon: MapPin,text: 'Dubai, UAE · New York, US' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)',
                }}>
                  <Icon size={12} color="var(--accent-light)" /> {text}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([cat, links]) => (
            <div key={cat}>
              <div style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)',
                marginBottom: '1rem',
              }}>
                {cat}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} style={{
                      fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)',
                      transition: 'color 0.15s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '1.25rem',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.25rem' }}>
              Trade Insights Newsletter
            </div>
            <p style={{ fontSize: '0.8125rem', margin: 0, color: 'rgba(255,255,255,0.45)' }}>
              HS code updates, duty changes, and logistics tips — weekly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                minWidth: 220, maxWidth: 280,
                padding: '0.6875rem 1rem',
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            {/* TODO: API — wire up to email list (Mailchimp / SendGrid / custom endpoint) */}
            <button className="btn btn-blue btn-sm" style={{ padding: '0.6875rem 1.25rem', fontSize: '0.875rem' }}>
              Subscribe <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '1rem',
          alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <p style={{ fontSize: '0.8125rem', margin: 0, color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} ZODFarAway. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a key={item} href="#" style={{
                fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', transition: 'color 0.15s',
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

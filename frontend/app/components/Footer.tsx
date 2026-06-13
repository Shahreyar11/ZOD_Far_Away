'use client';

import Link from 'next/link';
import {
  Package2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Share2,
  Rss,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Shield,
  Clock,
  Award,
} from 'lucide-react';

const footerLinks = {
  Services: [
    { label: 'Air Freight', href: '/services' },
    { label: 'Sea Freight', href: '/services' },
    { label: 'Customs Clearance', href: '/services' },
    { label: 'Warehousing', href: '/services' },
    { label: 'Last-Mile Delivery', href: '/services' },
  ],
  Tools: [
    { label: 'HS Code Search', href: '/hs-codes' },
    { label: 'Cost Calculator', href: '/cost-calculator' },
    { label: 'Supply Chain Planner', href: '/supply-chain' },
    { label: 'Duty Estimator', href: '/cost-calculator' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Get a Quote', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const socials = [
  { icon: Share2, href: '#', label: 'Twitter' },
  { icon: Rss, href: '#', label: 'LinkedIn' },
  { icon: MessageCircle, href: '#', label: 'Facebook' },
  { icon: ExternalLink, href: '#', label: 'Instagram' },
];

const trustBadges = [
  { icon: Shield, text: 'ISO 9001 Certified' },
  { icon: Clock, text: '24/7 Support' },
  { icon: Award, text: 'Award-Winning Service' },
  { icon: Globe, text: '150+ Countries' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: '#fff', marginTop: 'auto' }}>
      {/* Trust bar */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '1.25rem 0',
      }}>
        <div className="container" style={{
          display: 'flex', flexWrap: 'wrap', gap: '1.5rem',
          justifyContent: 'center', alignItems: 'center',
        }}>
          {trustBadges.map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', fontWeight: 500 }}>
              <Icon size={16} color="#00B4D8" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: '4rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #0096C7, #00B4D8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Package2 size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>
                  ZOD<span style={{ color: '#00B4D8' }}>Far</span>Away
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Global Logistics
                </div>
              </div>
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              End-to-end supply chain solutions. From concept to delivery, we handle every step of your global logistics journey.
            </p>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { icon: Phone, text: '+1 (800) ZOD-SHIP' },
                { icon: Mail, text: 'hello@zodfaraway.com' },
                { icon: MapPin, text: 'Dubai, UAE · New York, US' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.8125rem' }}>
                  <Icon size={14} color="#00B4D8" />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1.25rem' }}>
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(0,180,216,0.2)';
                    el.style.color = '#00B4D8';
                    el.style.borderColor = 'rgba(0,180,216,0.3)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(255,255,255,0.07)';
                    el.style.color = 'rgba(255,255,255,0.6)';
                    el.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {category}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255,255,255,0.5)',
                      transition: 'color 0.2s ease',
                      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00B4D8'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{
          margin: '3rem 0 2rem',
          padding: '2rem',
          borderRadius: 20,
          background: 'rgba(0,180,216,0.08)',
          border: '1px solid rgba(0,180,216,0.2)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Stay Updated</div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>Get trade insights, HS code updates & logistics tips.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.07)',
                color: '#fff',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                minWidth: 240,
              }}
            />
            <button className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}>
              Subscribe <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: '1.5rem',
          display: 'flex', flexWrap: 'wrap', gap: '1rem',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} ZODFarAway. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms', 'Cookies'].map(item => (
              <a key={item} href="#" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#00B4D8'; }}
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

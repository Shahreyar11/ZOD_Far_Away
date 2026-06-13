'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package2,
  Menu,
  X,
  ChevronDown,
  Globe,
  Calculator,
  BarChart3,
  Truck,
  Info,
  Mail,
  Home,
  Search,
} from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/hs-codes', label: 'HS Codes', icon: Search },
  { href: '/supply-chain', label: 'Supply Chain', icon: Globe },
  { href: '/cost-calculator', label: 'Cost Calculator', icon: Calculator },
  { href: '/services', label: 'Services', icon: Truck },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <nav
        className={clsx('navbar', scrolled && 'navbar-scrolled')}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? undefined : 'rgba(13,27,42,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #0096C7, #00B4D8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,180,216,0.4)',
            }}>
              <Package2 size={20} color="#fff" />
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#fff', letterSpacing: '-0.03em' }}>
                ZOD<span style={{ color: '#00B4D8' }}>Far</span>Away
              </span>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Global Logistics
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: 10,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: active ? '#00B4D8' : 'rgba(255,255,255,0.75)',
                  background: active ? 'rgba(0,180,216,0.12)' : 'transparent',
                  border: active ? '1px solid rgba(0,180,216,0.25)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.target as HTMLElement).style.color = '#fff';
                      (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.75)';
                      (e.target as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/contact" className="btn btn-amber" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
              className="btn btn-amber desktop-cta">
              Get a Quote
            </Link>
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="mobile-menu-btn"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                width: 42, height: 42,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        pointerEvents: mobileOpen ? 'all' : 'none',
      }}>
        {/* Overlay */}
        <div onClick={() => setMobileOpen(false)} style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          opacity: mobileOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }} />

        {/* Drawer */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: 'min(320px, 90vw)',
          height: '100%',
          background: 'var(--navy)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          overflowY: 'auto',
        }}>
          {/* Drawer Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Menu</span>
            <button onClick={() => setMobileOpen(false)} style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
            }}>
              <X size={16} />
            </button>
          </div>

          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: 12,
                color: active ? '#00B4D8' : 'rgba(255,255,255,0.75)',
                background: active ? 'rgba(0,180,216,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(0,180,216,0.25)' : 'rgba(255,255,255,0.06)'}`,
                fontSize: '0.9375rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
            <Link href="/contact" className="btn btn-amber" style={{ width: '100%', justifyContent: 'center' }}>
              Get a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 70 }} />

      <style>{`
        @media (min-width: 900px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
        }
      `}</style>
    </>
  );
}

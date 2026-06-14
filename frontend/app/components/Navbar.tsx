'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package2, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',                label: 'Home' },
  { href: '/hs-codes',        label: 'HS Codes' },
  { href: '/supply-chain',    label: 'Supply Chain' },
  { href: '/cost-calculator', label: 'Cost Calculator' },
  { href: '/route-optimization', label: 'Route Optimizer' },
  { href: '/theft-reports',    label: 'Theft Reports' },
  { href: '/warehouse-congestion', label: 'Warehouse Congestion' },
  { href: '/services',        label: 'Services' },
  { href: '/about',           label: 'About' },
];

export default function Navbar() {
  const pathname   = usePathname();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        transition: 'all 0.25s',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 68,
        }}>

          {/* ── Logo ─────────────────────────────────── */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(0,102,255,0.3)',
            }}>
              <Package2 size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.0625rem', letterSpacing: '-0.035em', color: 'var(--navy)' }}>
              ZOD<span style={{ color: 'var(--accent)' }}>Far</span>Away
            </span>
          </Link>

          {/* ── Desktop links ─────────────────────── */}
          <div className="hidden xl:flex" style={{ alignItems: 'center', gap: '0.125rem' }}>
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  background: active ? 'var(--accent-bg)' : 'transparent',
                  border: `1.5px solid ${active ? 'var(--accent-border)' : 'transparent'}`,
                  transition: 'all 0.15s',
                  letterSpacing: '-0.01em',
                }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--navy)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg)'; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── CTA + hamburger ──────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/contact" className="btn btn-blue hidden xl:inline-flex" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}>
              Get a Quote
            </Link>
            <button
              className="flex xl:hidden"
              onClick={() => setOpen(v => !v)}
              style={{
                width: 40, height: 40, borderRadius: 'var(--radius)',
                border: '1.5px solid var(--border)',
                background: 'var(--surface)',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--navy)',
                boxShadow: 'var(--shadow-xs)',
              }}
              aria-label="Toggle menu"
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────────── */}
      <>
        {/* Overlay */}
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(13,27,42,0.4)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.25s',
        }} />

        {/* Panel */}
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 999,
          width: 'min(300px,85vw)',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          padding: '1.25rem',
          display: 'flex', flexDirection: 'column', gap: '0.375rem',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
          boxShadow: '-8px 0 32px rgba(13,27,42,0.12)',
        }}>
          {/* header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)' }}>Navigation</span>
            <button onClick={() => setOpen(false)} style={{
              width: 34, height: 34, borderRadius: 'var(--radius)', border: '1.5px solid var(--border)',
              background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={16} color="var(--muted)" />
            </button>
          </div>

          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
                fontSize: '0.9375rem', fontWeight: active ? 600 : 500,
                color: active ? 'var(--accent)' : 'var(--navy)',
                background: active ? 'var(--accent-bg)' : 'transparent',
                border: `1.5px solid ${active ? 'var(--accent-border)' : 'transparent'}`,
                transition: 'all 0.15s',
              }}>
                {label}
              </Link>
            );
          })}

          <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <Link href="/contact" className="btn btn-blue" style={{ width: '100%', justifyContent: 'center' }}>
              Get a Quote
            </Link>
          </div>
        </div>
      </>

      {/* Spacer */}
      <div style={{ height: 68 }} />
    </>
  );
}

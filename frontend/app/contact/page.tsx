'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle2,
  Package2, Globe, Calculator, MessageSquare, ArrowRight,
} from 'lucide-react';

const contactMethods = [
  { icon: Phone, title: 'Call Us', value: '+1 (800) ZOD-SHIP', sub: 'Mon–Fri, 8am–8pm (GST)', color: '#00B4D8' },
  { icon: Mail, title: 'Email Us', value: 'hello@zodfaraway.com', sub: 'Response within 2 hours', color: '#F4A261' },
  { icon: MessageSquare, title: 'Live Chat', value: 'Chat on our platform', sub: '24/7 AI + human support', color: '#A78BFA' },
  { icon: MapPin, title: 'Visit Us', value: 'Dubai HQ, UAE', sub: 'DIFC, Gate Avenue', color: '#22C55E' },
];

const enquiryTypes = [
  'General Enquiry',
  'Get a Freight Quote',
  'Customs & Compliance',
  'HS Code Classification Help',
  'Warehousing & Distribution',
  'Partnership / B2B',
  'Technical Support',
];

const offices = [
  { city: 'Dubai (HQ)', address: 'Gate Avenue, DIFC, Dubai, UAE', phone: '+971 4 000 0000', flag: '🇦🇪' },
  { city: 'London', address: '1 Canada Square, Canary Wharf, London E14', phone: '+44 20 0000 0000', flag: '🇬🇧' },
  { city: 'Singapore', address: '1 Raffles Place, #20-01, Singapore', phone: '+65 6000 0000', flag: '🇸🇬' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', enquiry: '', message: '', shipmentOrigin: '', shipmentDest: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  }

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <div className="section-label"><Mail size={14} /> Contact Us</div>
          <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>
            Let's <span className="text-gradient">Talk Logistics</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.7, fontSize: '1.0625rem' }}>
            Whether you need a freight quote, HS code help, or just want to explore how we can support your supply chain — we're here.
          </p>
        </div>
      </div>

      {/* Contact method cards */}
      <div style={{ background: '#fff', padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-4">
            {contactMethods.map(({ icon: Icon, title, value, sub, color }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)', background: 'var(--surface)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${color}20`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)', marginBottom: '0.125rem' }}>{title}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color, marginBottom: '0.25rem' }}>{value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Form */}
          <div className="card" style={{ padding: '2.5rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(34,197,94,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}>
                  <CheckCircle2 size={36} color="#22C55E" />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--navy)' }}>Message Sent!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                  Thank you, <strong>{form.name}</strong>! One of our logistics experts will reach out to you within 2 business hours.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name:'',company:'',email:'',phone:'',enquiry:'',message:'',shipmentOrigin:'',shipmentDest:'' }); }}
                  className="btn btn-outline">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.375rem', color: 'var(--navy)' }}>Send Us a Message</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>We respond within 2 business hours.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label>Full Name *</label>
                      <input className="input" required value={form.name} onChange={update('name')} placeholder="John Smith" />
                    </div>
                    <div>
                      <label>Company</label>
                      <input className="input" value={form.company} onChange={update('company')} placeholder="Acme Corp" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label>Email *</label>
                      <input className="input" type="email" required value={form.email} onChange={update('email')} placeholder="john@company.com" />
                    </div>
                    <div>
                      <label>Phone</label>
                      <input className="input" type="tel" value={form.phone} onChange={update('phone')} placeholder="+1 555 000 0000" />
                    </div>
                  </div>

                  <div>
                    <label>Enquiry Type</label>
                    <select className="input select" value={form.enquiry} onChange={update('enquiry')}>
                      <option value="">Select enquiry type…</option>
                      {enquiryTypes.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label>Shipment Origin</label>
                      <input className="input" value={form.shipmentOrigin} onChange={update('shipmentOrigin')} placeholder="e.g. China" />
                    </div>
                    <div>
                      <label>Destination</label>
                      <input className="input" value={form.shipmentDest} onChange={update('shipmentDest')} placeholder="e.g. UK" />
                    </div>
                  </div>

                  <div>
                    <label>Message *</label>
                    <textarea
                      className="input"
                      required
                      rows={4}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Tell us about your shipment, product, or question…"
                      style={{ resize: 'vertical', minHeight: 110 }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '1rem', justifyContent: 'center' }} disabled={loading}>
                    {loading ? 'Sending…' : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Offices */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--navy)' }}>Our Offices</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {offices.map(({ city, address, phone, flag }) => (
                  <div key={city} style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.375rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{flag}</span> {city}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><MapPin size={12} /> {address}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Phone size={12} /> {phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick tools */}
            <div className="card" style={{ background: 'var(--navy)', border: 'none' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Quick Tools</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { href: '/hs-codes', icon: Globe, label: 'Search HS Codes' },
                  { href: '/cost-calculator', icon: Calculator, label: 'Estimate Costs & Duties' },
                  { href: '/supply-chain', icon: Package2, label: 'Plan Supply Chain' },
                ].map(({ href, icon: Icon, label }) => (
                  <Link key={href} href={href} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.875rem 1rem', borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.9rem', fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,180,216,0.15)'; (e.currentTarget as HTMLElement).style.color = '#00B4D8'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
                  >
                    <Icon size={16} /> {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div style={{ padding: '1.25rem', background: 'rgba(0,180,216,0.07)', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', fontWeight: 700, color: 'var(--navy)' }}>
                <Clock size={16} color="var(--teal)" /> Response Times
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <div>📧 Email — within 2 business hours</div>
                <div>📞 Phone — immediate (business hours)</div>
                <div>💬 Live Chat — 24/7 (under 2 minutes)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

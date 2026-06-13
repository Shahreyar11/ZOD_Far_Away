'use client';

import Link from 'next/link';
import {
  Search, Lightbulb, Shield, Ship, Package2, Truck,
  CheckCircle2, Clock, ArrowRight, Globe, FileText,
  DollarSign, AlertTriangle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useState } from 'react';

const stages = [
  {
    num: '01',
    icon: Lightbulb,
    title: 'Product Ideation & Research',
    color: '#F4A261',
    duration: '1–4 weeks',
    desc: 'Define your product specifications, target markets, and supplier landscape. Evaluate feasibility, MOQs, and initial cost projections.',
    tasks: [
      'Define product specifications and SKUs',
      'Research potential suppliers (Alibaba, trade shows)',
      'Request samples and evaluate quality',
      'Calculate preliminary landed cost estimate',
      'Check IP / trademark in target country',
    ],
    risks: ['Poor quality samples', 'IP infringement', 'Unrealistic MOQs'],
    documents: ['Product specification sheet', 'NDA with suppliers'],
  },
  {
    num: '02',
    icon: Search,
    title: 'HS Code Classification',
    color: '#00B4D8',
    duration: '1–3 days',
    desc: 'Correctly classify your product under the Harmonized System. This determines duties, restrictions, and required permits.',
    tasks: [
      'Use our HS Code Explorer to find the correct chapter',
      'Verify with destination country tariff schedule',
      'Check for preferential duty rates (FTAs)',
      'Identify any restricted / prohibited classifications',
      'Get binding ruling if uncertain',
    ],
    risks: ['Misclassification penalties (up to 20% surcharge)', 'Shipment holds'],
    documents: ['HS Code ruling letter', 'Product technical sheet'],
  },
  {
    num: '03',
    icon: FileText,
    title: 'Compliance & Licensing',
    color: '#A78BFA',
    duration: '1–6 weeks',
    desc: 'Ensure full regulatory compliance for origin and destination countries. Arrange any required licenses, permits, or certifications.',
    tasks: [
      'Export license (if controlled goods)',
      'Import permit from destination authority',
      'Product certifications (CE, FDA, RoHS, etc.)',
      'Certificate of Origin (CoO)',
      'Phytosanitary / health certificate (food & agri)',
    ],
    risks: ['Delayed approvals', 'Non-compliance fines', 'Shipment seizure'],
    documents: ['Export license', 'CoO', 'Product certificates', 'Import permit'],
  },
  {
    num: '04',
    icon: DollarSign,
    title: 'Cost & Duty Calculation',
    color: '#22C55E',
    duration: '1 day',
    desc: 'Calculate total landed cost: product cost + freight + insurance + import duties + VAT + brokerage fees.',
    tasks: [
      'Get freight quotes (air vs sea)',
      'Calculate import duty using HS code & origin',
      'Add VAT / GST of destination country',
      'Include customs brokerage fees',
      'Factor in warehousing & last-mile cost',
    ],
    risks: ['Hidden fees', 'Currency fluctuation', 'Unexpected surcharges'],
    documents: ['Pro forma invoice', 'Freight quote', 'Insurance certificate'],
  },
  {
    num: '05',
    icon: Ship,
    title: 'Freight & Booking',
    color: '#F43F5E',
    duration: '1–2 weeks',
    desc: 'Choose your freight mode, book with a carrier, and arrange cargo insurance. Prepare all shipping documentation.',
    tasks: [
      'Compare air vs sea rates & transit times',
      'Book freight with carrier or forwarder',
      'Arrange marine cargo insurance',
      'Prepare Bill of Lading / Air Waybill',
      'Confirm Incoterms (EXW, FOB, CIF, DDP)',
    ],
    risks: ['Port congestion', 'Cargo damage', 'Schedule changes'],
    documents: ['Bill of Lading', 'Air Waybill', 'Insurance certificate', 'Packing list'],
  },
  {
    num: '06',
    icon: Shield,
    title: 'Customs Clearance',
    color: '#0D1B2A',
    duration: '1–5 days',
    desc: 'File customs declarations, pay duties, and obtain release from customs authority at the destination port.',
    tasks: [
      'Submit customs entry / import declaration',
      'Pay import duties and taxes',
      'Customs examination (if selected)',
      'Obtain customs release',
      'Handle any queries or holds',
    ],
    risks: ['Random inspections', 'Document errors', 'Duty disputes'],
    documents: ['Commercial invoice', 'Packing list', 'CoO', 'Bill of Lading', 'Import declaration'],
  },
  {
    num: '07',
    icon: Truck,
    title: 'Last-Mile Delivery',
    color: '#00B4D8',
    duration: '1–7 days',
    desc: 'Transport from the port / warehouse to the final destination with real-time tracking and proof of delivery.',
    tasks: [
      'Port-to-warehouse transport',
      'Customs de-stuffing and inspection',
      'Final-mile courier or own transport',
      'Real-time tracking notifications',
      'Collect proof of delivery (POD)',
    ],
    risks: ['Delivery delays', 'Damage during final mile', 'Failed delivery attempts'],
    documents: ['Delivery order', 'Proof of delivery', 'Warehouse receipt'],
  },
];

export default function SupplyChainPage() {
  const [expanded, setExpanded] = useState<string | null>('01');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <div className="section-label"><Globe size={14} /> Supply Chain Journey</div>
          <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>
            From <span className="text-gradient-amber">Idea</span> to <span className="text-gradient">Delivery</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 560, lineHeight: 1.7, fontSize: '1.0625rem' }}>
            A complete visual guide through every stage of your international supply chain — with timelines, required documents, and risk alerts.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[
              { icon: Clock, text: '6–14 weeks typical end-to-end' },
              { icon: FileText, text: '15+ documents managed' },
              { icon: Globe, text: '200+ countries supported' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                <Icon size={16} color="#00B4D8" /> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar indicator */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        <div className="container" style={{ display: 'flex', gap: 0, padding: '0 1.5rem', minWidth: 'max-content' }}>
          {stages.map(({ num, title, icon: Icon, color }, i) => (
            <button key={num}
              onClick={() => setExpanded(expanded === num ? null : num)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 1.25rem',
                border: 'none', background: 'none',
                borderBottom: `3px solid ${expanded === num ? color : 'transparent'}`,
                cursor: 'pointer',
                color: expanded === num ? color : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: expanded === num ? color : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                color: expanded === num ? '#fff' : 'var(--text-muted)',
              }}>{num}</div>
              {title.split(' ')[0]} {title.split(' ')[1] || ''}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion stages */}
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {stages.map(({ num, icon: Icon, title, color, duration, desc, tasks, risks, documents }) => {
            const open = expanded === num;
            return (
              <div key={num} className="card" style={{
                padding: 0,
                border: open ? `2px solid ${color}40` : '1px solid var(--border)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}>
                {/* Header row */}
                <button onClick={() => setExpanded(open ? null : num)} style={{
                  display: 'flex', alignItems: 'center', gap: '1.25rem',
                  width: '100%', padding: '1.5rem 1.75rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'Inter, sans-serif',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: `${color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>Stage {num} — {title}</span>
                      <span className="badge" style={{ background: `${color}18`, color }}>{duration}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{desc.slice(0, 90)}…</p>
                  </div>
                  <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Expanded content */}
                {open && (
                  <div style={{
                    padding: '0 1.75rem 1.75rem',
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem',
                    borderTop: `1px solid ${color}20`,
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.875rem', paddingTop: '1.25rem' }}>
                        Key Tasks
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tasks.map(t => (
                          <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <CheckCircle2 size={15} color="#22C55E" style={{ marginTop: 2, flexShrink: 0 }} /> {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.875rem', paddingTop: '1.25rem' }}>
                        Risk Alerts
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {risks.map(r => (
                          <div key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#C05621' }}>
                            <AlertTriangle size={15} color="#F4A261" style={{ marginTop: 2, flexShrink: 0 }} /> {r}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.875rem', paddingTop: '1.25rem' }}>
                        Documents Required
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {documents.map(d => (
                          <span key={d} className="tag">{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="card" style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
          border: 'none', textAlign: 'center',
        }}>
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Ready to Start Your Journey?</h3>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            Let our team handle every stage while you focus on growing your business.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cost-calculator" className="btn btn-primary">Calculate Total Cost <ArrowRight size={16} /></Link>
            <Link href="/contact" className="btn btn-ghost">Talk to an Expert</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

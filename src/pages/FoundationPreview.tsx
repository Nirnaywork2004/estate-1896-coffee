import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useSupabaseStatus } from '../hooks/useSupabaseStatus';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { categoriesService } from '../services/categories.service';
import { productsService } from '../services/products.service';
import { settingsService } from '../services/settings.service';
import { formatINR, calculateGST } from '../utils/currency';
import { formatIndianPhone, isValidIndianMobile } from '../utils/phone';
import { formatAddress, isValidPincode } from '../utils/address';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  Palette,
  Type,
  Smartphone,
  ShieldCheck,
  Send,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export const FoundationPreview: React.FC = () => {
  const supabaseStatus = useSupabaseStatus();
  const prefersReducedMotion = useReducedMotion();

  // Test states for India-first utilities
  const [testAmount, setTestAmount] = useState<number>(240);
  const [testPhone, setTestPhone] = useState<string>('9845018960');
  const [testPincode, setTestPincode] = useState<string>('560038');

  // Loaded services state
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setDataLoading(true);
      try {
        const [catRes, prodRes, _setRes] = await Promise.all([
          categoriesService.getActiveCategories(),
          productsService.getProducts(),
          settingsService.getPublicSettings(),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, []);

  const gstBreakdown = calculateGST(testAmount);
  const isPhoneValid = isValidIndianMobile(testPhone);
  const isPinValid = isValidPincode(testPincode);

  const sampleAddress = {
    buildingOrHouse: 'The Heritage Villa, No. 42',
    street: '100 Feet Road, 12th Main',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka' as const,
    pincode: testPincode,
    country: 'India' as const,
  };

  const sampleWhatsAppUrl = generateWhatsAppOrderUrl({
    storePhone: '9845018960',
    customerName: 'Aarav Sharma',
    orderType: 'dine_in',
    items: [
      {
        productId: 'p111',
        productName: 'Chikmagalur Heritage Washed V60',
        unitPrice: 240,
        quantity: 2,
        selectedOptions: [{ type: 'brewing_method', name: 'Hario V60', priceModifier: 0 }],
        itemTotal: 480,
      },
    ],
    subtotal: 480,
    total: 504,
  });

  return (
    <div className="py-12 md:py-16 selection:bg-caramel-500 selection:text-espresso-950">
      <Container size="xl" className="space-y-12">
        {/* Foundation Header */}
        <header className="border-b border-roast-700/80 pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="copper" size="sm">Phase 1 — Complete</Badge>
                <Badge variant="caramel" size="sm">India-First Architecture</Badge>
              </div>
              <h1 className="font-serif text-fluid-h1 text-cream-50 font-bold tracking-tight">
                Estate 1896 <span className="text-caramel-400 italic">Foundation Console</span>
              </h1>
              <p className="text-cream-300 font-sans text-fluid-body mt-2 max-w-2xl">
                Cinematic coffee roastery architecture, Supabase database integration, India-first data structures, and design tokens verification harness.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 bg-roast-800/80 border border-roast-700 rounded text-xs text-cream-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Vite + React + TS Ready</span>
              </div>
              <div className="px-4 py-2 bg-roast-800/80 border border-roast-700 rounded text-xs text-cream-300">
                Reduced Motion: <span className="font-mono text-copper-300">{prefersReducedMotion ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Section 1: Supabase Backend Status */}
        <section aria-labelledby="supabase-status-heading">
          <Card variant="elevated" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-roast-700/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-caramel-500/10 rounded-lg text-caramel-400 border border-caramel-500/20">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 id="supabase-status-heading" className="font-serif text-xl text-cream-50 font-semibold">
                    Supabase Infrastructure & Security
                  </h2>
                  <p className="text-xs text-cream-300 font-mono">
                    Project: <span className="text-cream-100">{supabaseStatus.projectId}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => supabaseStatus.recheck()}
                  isLoading={supabaseStatus.loading}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Recheck Status
                </Button>
                {supabaseStatus.isConfigured ? (
                  <Badge variant="success" size="md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Client Configured
                  </Badge>
                ) : (
                  <Badge variant="amber" size="md">
                    <AlertTriangle className="w-3.5 h-3.5" /> Key Pending
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-espresso-950/60 rounded-md border border-roast-800">
                <p className="text-xs text-cream-400 uppercase tracking-widest font-semibold mb-1">API Endpoint</p>
                <p className="font-mono text-xs text-cream-200 truncate">{supabaseStatus.url}</p>
              </div>

              <div className="p-4 bg-espresso-950/60 rounded-md border border-roast-800">
                <p className="text-xs text-cream-400 uppercase tracking-widest font-semibold mb-1">Backend Ping / Latency</p>
                <p className="font-mono text-xs text-cream-200">
                  {supabaseStatus.latencyMs !== undefined ? `${supabaseStatus.latencyMs} ms` : 'Standby / Local Mock Mode'}
                </p>
              </div>

              <div className="p-4 bg-espresso-950/60 rounded-md border border-roast-800">
                <p className="text-xs text-cream-400 uppercase tracking-widest font-semibold mb-1">Security / RLS</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>RLS Policies Configured</span>
                </div>
              </div>
            </div>

            {supabaseStatus.errorMessage && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-md text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-300 mb-0.5">Database Notice:</p>
                  <p>{supabaseStatus.errorMessage}</p>
                  <p className="text-cream-400 mt-1">
                    SQL migration script ready in <code className="text-caramel-300">supabase/migrations/20260827000000_foundation_schema.sql</code> and seed in <code className="text-caramel-300">supabase/seed.sql</code>.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Section 2: Design Tokens & Visual Aesthetics */}
        <section aria-labelledby="design-tokens-heading" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-copper-500/10 rounded-lg text-copper-400 border border-copper-500/20">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 id="design-tokens-heading" className="font-serif text-2xl text-cream-50 font-semibold">
                Design Tokens & Palette
              </h2>
              <p className="text-sm text-cream-300">
                Warm, cinematic, editorial palette tailored for high-end coffee roasters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { name: 'Deep Espresso', hex: '#0B0705', class: 'bg-espresso-950 border-roast-700', text: 'text-cream-100' },
              { name: 'Dark Roast', hex: '#20140D', class: 'bg-roast-900 border-roast-700', text: 'text-cream-100' },
              { name: 'Warm Cream', hex: '#F5EFEB', class: 'bg-cream-100 border-cream-200', text: 'text-espresso-950' },
              { name: 'Soft Beige', hex: '#D2C1AF', class: 'bg-beige-300 border-beige-400', text: 'text-espresso-950' },
              { name: 'Caramel Gold', hex: '#C88A4A', class: 'bg-caramel-500 border-caramel-400', text: 'text-espresso-950' },
              { name: 'Subtle Copper', hex: '#B86B43', class: 'bg-copper-500 border-copper-400', text: 'text-cream-50' },
              { name: 'Charcoal', hex: '#151515', class: 'bg-charcoal-900 border-charcoal-700', text: 'text-cream-100' },
              { name: 'Warm White', hex: '#FAF8F5', class: 'bg-warm-white border-cream-300', text: 'text-espresso-950' },
            ].map((token) => (
              <div key={token.name} className="p-3 rounded-lg bg-espresso-900/90 border border-roast-800 space-y-2">
                <div className={`h-14 rounded-md border ${token.class} flex items-center justify-center`}>
                  <span className={`text-[10px] font-mono font-semibold ${token.text}`}>{token.hex}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-cream-100">{token.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Typography Scales */}
        <section aria-labelledby="typography-heading">
          <Card variant="default" className="space-y-6">
            <div className="flex items-center gap-3 border-b border-roast-700/60 pb-4">
              <div className="p-2.5 bg-caramel-500/10 rounded-lg text-caramel-400 border border-caramel-500/20">
                <Type className="w-6 h-6" />
              </div>
              <div>
                <h2 id="typography-heading" className="font-serif text-xl text-cream-50 font-semibold">
                  Fluid Typography & Specimen Scales
                </h2>
                <p className="text-xs text-cream-300">
                  Editorial serif display headings paired with clean modern sans for UI and tabular numbers for pricing.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold font-mono">Fluid Display (clamp 40px–88px)</span>
                <p className="font-serif text-fluid-display font-bold text-cream-50 tracking-tight leading-none mt-1">
                  Artisanal Coffee
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-roast-800">
                <div>
                  <span className="text-xs uppercase tracking-widest text-copper-400 font-semibold font-mono">Editorial Headline (H2)</span>
                  <h3 className="font-serif text-fluid-h2 text-cream-100 font-semibold mt-1">
                    Single-Origin Beans From Heirloom Estates
                  </h3>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-cream-400 font-semibold font-mono">Modern Sans Body (clamp 15px–17px)</span>
                  <p className="font-sans text-fluid-body text-cream-300 leading-relaxed mt-1">
                    Hand-harvested at 4,200ft elevation under dense silver-oak forest canopies in Chikmagalur, Karnataka. Calibrated for delicate sweetness and velvet mouthfeel.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 4: India-First Architecture Utilities */}
        <section aria-labelledby="india-first-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-caramel-500/10 rounded-lg text-caramel-400 border border-caramel-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 id="india-first-heading" className="font-serif text-2xl text-cream-50 font-semibold">
                India-First Architecture Test Harness
              </h2>
              <p className="text-sm text-cream-300">
                Interactive verification for ₹ INR currency, +91 phone numbers, PIN codes, GST, and WhatsApp ordering payloads.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* INR & GST Calculator Test */}
            <Card variant="interactive" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-cream-100 font-medium">₹ INR & GST Calculator</h3>
                <Badge variant="caramel" size="sm">₹ Currency</Badge>
              </div>

              <div>
                <label htmlFor="inr-input" className="text-xs text-cream-400 block mb-1">
                  Test Subtotal (₹ INR):
                </label>
                <input
                  id="inr-input"
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value) || 0)}
                  className="w-full bg-espresso-950 border border-roast-700 rounded px-3 py-2 text-cream-100 font-mono text-sm focus:border-caramel-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-roast-800 text-xs font-mono">
                <div className="flex justify-between text-cream-300">
                  <span>Formatted INR:</span>
                  <span className="text-caramel-300 font-bold text-sm">{formatINR(testAmount)}</span>
                </div>
                <div className="flex justify-between text-cream-400">
                  <span>CGST (2.5%):</span>
                  <span>{formatINR(gstBreakdown.cgst, { showDecimals: true })}</span>
                </div>
                <div className="flex justify-between text-cream-400">
                  <span>SGST (2.5%):</span>
                  <span>{formatINR(gstBreakdown.sgst, { showDecimals: true })}</span>
                </div>
                <div className="flex justify-between text-cream-100 pt-1 border-t border-roast-800 font-semibold">
                  <span>Total Payable:</span>
                  <span className="text-copper-400">{formatINR(gstBreakdown.total, { showDecimals: true })}</span>
                </div>
              </div>
            </Card>

            {/* +91 Phone & PIN Code Verification */}
            <Card variant="interactive" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-cream-100 font-medium">+91 Phone & PIN Code</h3>
                <Badge variant="copper" size="sm">Validation</Badge>
              </div>

              <div>
                <label htmlFor="phone-input" className="text-xs text-cream-400 block mb-1">
                  Customer Mobile (+91):
                </label>
                <div className="relative">
                  <input
                    id="phone-input"
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full bg-espresso-950 border border-roast-700 rounded px-3 py-2 text-cream-100 font-mono text-sm focus:border-copper-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs">
                    {isPhoneValid ? <span className="text-emerald-400">✓ Valid</span> : <span className="text-amber-400">✕ Invalid</span>}
                  </span>
                </div>
                <p className="text-[11px] text-cream-400 font-mono mt-1">Formatted: {formatIndianPhone(testPhone)}</p>
              </div>

              <div>
                <label htmlFor="pin-input" className="text-xs text-cream-400 block mb-1">
                  Indian Postal PIN Code:
                </label>
                <div className="relative">
                  <input
                    id="pin-input"
                    type="text"
                    maxLength={6}
                    value={testPincode}
                    onChange={(e) => setTestPincode(e.target.value)}
                    className="w-full bg-espresso-950 border border-roast-700 rounded px-3 py-2 text-cream-100 font-mono text-sm focus:border-copper-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs">
                    {isPinValid ? <span className="text-emerald-400">✓ 6-Digit</span> : <span className="text-amber-400">✕ Invalid</span>}
                  </span>
                </div>
              </div>
            </Card>

            {/* WhatsApp Ordering Generator */}
            <Card variant="interactive" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-cream-100 font-medium">WhatsApp Direct Order</h3>
                <Badge variant="roast" size="sm">Social Commerce</Badge>
              </div>

              <p className="text-xs text-cream-300">
                Pre-formatted customer order payload generator supporting one-tap WhatsApp ordering.
              </p>

              <div className="p-2.5 bg-espresso-950 rounded border border-roast-800 text-[11px] text-cream-400 font-mono truncate">
                {sampleWhatsAppUrl}
              </div>

              <div className="pt-2">
                <a
                  href={sampleWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 rounded px-4 py-2.5 text-xs font-semibold tracking-editorial transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Test WhatsApp Payload
                </a>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 5: Data Models & Service Layer Readiness */}
        <section aria-labelledby="data-readiness-heading">
          <Card variant="elevated" className="space-y-6">
            <div className="flex items-center justify-between border-b border-roast-700/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-copper-500/10 rounded-lg text-copper-400 border border-copper-500/20">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 id="data-readiness-heading" className="font-serif text-xl text-cream-50 font-semibold">
                    Data Layer & Entity Readiness
                  </h2>
                  <p className="text-xs text-cream-300">
                    {dataLoading ? 'Loading entities...' : `Active categories (${categories.length}), Menu items (${products.length}), Store settings loaded.`}
                  </p>
                </div>
              </div>

              <Badge variant="caramel" size="sm">
                <Sparkles className="w-3.5 h-3.5" /> Seed Data Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-espresso-950/80 rounded-md border border-roast-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono text-copper-400">{product.originRegion || 'Estate Micro-Lot'}</span>
                      <span className="text-xs font-mono font-bold text-caramel-400">{formatINR(product.price)}</span>
                    </div>
                    <h4 className="font-serif text-sm font-semibold text-cream-100 line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-cream-400 line-clamp-2 mt-1">{product.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-roast-900">
                    {product.flavorNotes?.slice(0, 2).map((note: string) => (
                      <span key={note} className="text-[10px] bg-roast-800/90 text-cream-300 px-2 py-0.5 rounded">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Store Information summary */}
            <div className="p-4 bg-espresso-950/60 rounded-md border border-roast-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-cream-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-copper-400 shrink-0" />
                <span>{formatAddress(sampleAddress)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-caramel-400 shrink-0" />
                <span>Daily 07:00 AM — 11:30 PM | UPI: <code className="text-caramel-300">estate1896@okhdfcbank</code></span>
              </div>
            </div>
          </Card>
        </section>

        {/* Foundation Completion Footer Note */}
        <footer className="text-center py-6 border-t border-roast-800/80 text-xs text-cream-400 space-y-1">
          <p className="font-mono">
            ESTATE 1896 CAFE ARCHITECTURE — PHASE 1 FOUNDATION COMPLETE
          </p>
          <p>
            Ready for Phase 2 UI implementations (Cinematic Hero, Dynamic Menu, India Ordering Cart, Ambient Experience).
          </p>
        </footer>
      </Container>
    </div>
  );
};

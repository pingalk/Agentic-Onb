import React from 'react';
import { PaymentLinkMiniCard } from './chat/PaymentLinkMiniCard';
import { SettlementCard } from './chat/artifacts/FundsAddedComponents';

/**
 * CardShowcase - Storybook-style page showing all card types with premium styling
 *
 * Premium design patterns from HomeCards:
 * - Subtle gradient backgrounds (white → off-white)
 * - Display font (TASA_Orbiter_Display) for amounts
 * - 12px muted gray labels with negative letter-spacing
 * - Neutral borders (#dee1e3) or soft accent (#d1fae5)
 * - hover:shadow-md for interaction
 * - 420px max-width
 */
export const CardShowcase = () => {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Card Showcase</h1>
          <p className="text-slate-500">Premium card designs inspired by HomeCards</p>
        </div>

        {/* Cards */}
        <div className="space-y-8">

          {/* 1. Payment Link Draft */}
          <div className="border rounded-xl p-6 bg-slate-50">
            <div className="text-xs font-mono text-slate-500 mb-3">payment_link_form_card (draft)</div>
            <PaymentLinkMiniCard
              formData={{ amount: '15000', purpose: 'Payment retry for failed transaction', email: 'rahul@gmail.com' }}
              status="draft"
              onClick={() => {}}
            />
          </div>

          {/* 2. Payment Link Created */}
          <div className="border rounded-xl p-6 bg-slate-50">
            <div className="text-xs font-mono text-slate-500 mb-3">payment_link_form_card (completed)</div>
            <PaymentLinkMiniCard
              formData={{ amount: '15000', purpose: 'Payment retry for failed transaction', email: 'rahul@gmail.com' }}
              status="completed"
              linkUrl="https://rzp.io/l/hqpwg0du"
            />
          </div>

          {/* 3. Settlement Card */}
          <div className="border rounded-xl p-6 bg-slate-50">
            <div className="text-xs font-mono text-slate-500 mb-3">settlement_card</div>
            <SettlementCard amount="3,10,000" date="Will deposit tomorrow 10:00 AM" step={1} />
          </div>

          {/* 4. Instant Settlements Card */}
          <div className="border rounded-xl p-6 bg-slate-50">
            <div className="text-xs font-mono text-slate-500 mb-3">instant_settlement_offer</div>
            <div
              className="w-full max-w-[420px] rounded-xl overflow-hidden border border-[#d1fae5] transition-shadow hover:shadow-md"
              style={{ background: 'linear-gradient(180deg, rgb(255,255,255) 0%, rgb(255,255,255) 72%, rgb(240,253,244) 100%)' }}
            >
              <div className="p-4">
                {/* Label */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22c55e]/10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                  <span className="text-[12px] font-medium text-[#22c55e] tracking-[-0.3px]">Instant Settlements</span>
                </div>

                {/* Headline */}
                <p className="text-[16px] font-medium text-[#050505] mb-3">Get paid instantly</p>

                {/* Checklist */}
                <div className="flex flex-col gap-2">
                  {['works even on bank holidays, non-banking hours', 'same day settlements', 'bank transfers in 10s'].map((text, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-[14px] text-[#7d7d7d]">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

import React, { useRef, useEffect, useState } from 'react';
import { Dashboard } from '../dashboard/Dashboard';

// Scene to section index mapping
const sceneToIndex: Record<string, number> = {
  'scene1': 0,  // Prologue
  'scene2': 1,  // The Conversation
  'scene3': 2,  // Photo Extraction
  'scene4': 3,  // Agentic CLI
  'scene5': 4,  // Agent Watching
  'scene6': 5,  // Proactive Recovery
};

export const Presentation: React.FC = () => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

  // Handle scene changes from prototype
  const handleSceneChange = (sceneId: string) => {
    const index = sceneToIndex[sceneId];
    if (index !== undefined && sectionsRef.current[index]) {
      sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Intersection observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionsRef.current.findIndex((ref) => ref === entry.target);
          if (index !== -1 && entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    sectionsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const isVisible = (index: number) => visibleSections.has(index);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Panel: Narrative */}
      <div className="w-[40%] h-full overflow-y-auto bg-black text-white scroll-smooth"
           style={{ scrollBehavior: 'smooth' }}>

        {/* PROLOGUE */}
        <section
          ref={(el) => (sectionsRef.current[0] = el)}
          className="min-h-screen flex items-center justify-center p-16 relative"
        >
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
          <div className={`text-center transition-all duration-1000 ${isVisible(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-7xl font-black mb-8"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.03em'
                }}>
              The Agentic Lifecycle
            </h1>
            <p className="text-2xl text-white/60 leading-relaxed max-w-2xl mx-auto">
              The invisible friction killing businesses—and the intelligence that bridges the gaps
            </p>
          </div>
        </section>

        {/* THE CONVERSATION */}
        <section
          ref={(el) => (sectionsRef.current[1] = el)}
          className="min-h-screen flex items-center justify-center p-16"
          style={{ background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.2) 0%, #000 70%)' }}
        >
          <div className={`max-w-xl transition-all duration-1000 ${isVisible(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-3xl font-bold text-emerald-400 mb-12 text-center">
              Today, Kavita doesn't face a form. She meets an Agent.
            </p>

            {/* Chat Demo */}
            <div className="bg-white/95 rounded-2xl p-8 shadow-2xl">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl rounded-tl max-w-[80%] text-base">
                  Welcome, Kavita! Let's get "Flour Power" open for business. I found a GSTIN ending in '1AZ' registered to you. Is that correct?
                </div>
              </div>
              <div className="flex gap-4 justify-end mb-6">
                <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr max-w-[60%] text-base">
                  Yes, that's me!
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl rounded-tl max-w-[80%] text-base">
                  Perfect. I've auto-filled your business address. Now I just need to verify your bank account.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PHOTO EXTRACTION */}
        <section
          ref={(el) => (sectionsRef.current[2] = el)}
          className="min-h-screen flex items-center justify-center p-16"
          style={{ background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.2) 0%, #000 70%)' }}
        >
          <div className={`max-w-3xl transition-all duration-1000 ${isVisible(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl text-white/80 text-center mb-12">
              She snaps a photo. The Agent's vision model reads the image.
            </p>

            <div className="grid grid-cols-2 gap-8">
              {/* Photo Preview */}
              <div className="bg-white rounded-2xl p-8 shadow-xl transform -rotate-2">
                <div className="text-xl font-bold text-indigo-600 text-center mb-6">UNION BANK PASSBOOK</div>
                <div className="text-gray-900 space-y-2">
                  <div><strong>Account Holder:</strong> FLOUR POWER BAKERY</div>
                  <div>
                    <strong>Account Number:</strong>{' '}
                    <span className="bg-emerald-200 px-2 py-1 rounded border-2 border-emerald-400 font-bold animate-pulse">
                      1234567890123
                    </span>
                  </div>
                  <div>
                    <strong>IFSC Code:</strong>{' '}
                    <span className="bg-emerald-200 px-2 py-1 rounded border-2 border-emerald-400 font-bold animate-pulse">
                      UNIB0001234
                    </span>
                  </div>
                </div>
              </div>

              {/* Extraction Result */}
              <div className="bg-emerald-500/10 border-2 border-emerald-400 rounded-2xl p-8 flex flex-col items-center justify-center">
                <div className="text-8xl text-emerald-400 mb-4">✓</div>
                <div className="text-2xl font-bold text-emerald-400 mb-4">Account Verified</div>
                <div className="text-white/70 text-sm text-center">
                  Vision model extracted IFSC + Account<br />
                  Penny Drop: ₹1 sent → Bank confirmed
                </div>
              </div>
            </div>

            <p className="text-2xl italic text-white/80 mt-12 border-l-4 border-emerald-400 pl-8">
              "In three minutes, Kavita went from 'Concept' to 'Compliance.'"
            </p>
          </div>
        </section>

        {/* AGENTIC CLI */}
        <section
          ref={(el) => (sectionsRef.current[3] = el)}
          className="min-h-screen flex items-center justify-center p-16"
          style={{ background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.2) 0%, #000 70%)' }}
        >
          <div className={`max-w-3xl w-full transition-all duration-1000 ${isVisible(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-3xl font-bold text-blue-400 mb-12 text-center">
              Rahul doesn't want to read. He wants to build.
            </p>

            {/* Code Editor */}
            <div className="bg-[#1E1E1E] rounded-2xl p-8 shadow-2xl font-mono">
              <div className="flex gap-2 mb-6 pb-4 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-500 ml-3 text-sm">checkout.js</span>
              </div>

              <div className="text-emerald-400 text-sm space-y-2">
                <div>// Agentic CLI - Auto-generating integration...</div>
                <div>const razorpay = new Razorpay({'{'}</div>
                <div className="pl-4">key_id: process.env.RAZORPAY_KEY,</div>
                <div className="pl-4 text-red-400">key_secret: "rzp_test_hardcoded" // Rahul's shortcut</div>
                <div>{'}'});</div>
              </div>

              <div className="bg-red-500/15 border-l-4 border-red-500 p-4 rounded my-6">
                <div className="text-red-400 font-bold mb-1">🚨 Critical Security Risk</div>
                <div className="text-white/70 text-sm">Secret Key exposed. Will leak if committed.</div>
              </div>

              <div className="bg-emerald-500/15 border-l-4 border-emerald-500 p-4 rounded">
                <div className="text-emerald-400 font-bold mb-1">✓ Agentic Guardrails: Auto-fix Applied</div>
                <div className="text-white/70 text-sm">Moved keys to .env • Updated .gitignore</div>
              </div>

              <div className="mt-6 p-4 bg-emerald-500 rounded-xl text-center text-white font-bold">
                ✓ Audit Passed • Ready for Production
              </div>
            </div>

            <p className="text-xl italic text-white/70 mt-8 border-l-4 border-blue-400 pl-6">
              "The Agent didn't just write code; it enforced best practices."
            </p>
          </div>
        </section>

        {/* AGENT WATCHING */}
        <section
          ref={(el) => (sectionsRef.current[4] = el)}
          className="min-h-screen flex items-center justify-center p-16"
          style={{ background: 'radial-gradient(ellipse at center, rgba(99, 91, 255, 0.2) 0%, #000 70%)' }}
        >
          <div className={`max-w-3xl w-full transition-all duration-1000 ${isVisible(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-3xl font-bold text-indigo-400 mb-12 text-center">
              But the Agent is watching the infrastructure.
            </p>

            {/* Dashboard Alert */}
            <div className="bg-gray-900/90 border-2 border-red-500/50 rounded-2xl p-8 backdrop-blur-xl">
              <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 flex items-center gap-6 mb-8 animate-pulse">
                <div className="text-5xl">⚠️</div>
                <div>
                  <div className="text-2xl font-bold text-red-400 mb-2">Payment Failure Spike Detected</div>
                  <div className="text-white/70">Kavita asks: "Why are payments failing right now?"</div>
                </div>
              </div>

              {/* Network Graph */}
              <div className="bg-black rounded-xl p-6 mb-6">
                <div className="text-white/50 text-sm mb-4">Real-Time Network Health Scan</div>
                <div className="h-1 bg-gradient-to-r from-emerald-400 from-60% to-red-500 to-60% rounded mb-3" />
                <div className="text-sm text-white/60">
                  ✓ Google Pay: Normal • ✓ PhonePe: Normal • <span className="text-red-400">✗ Axis Bank UPI: 40% Failure</span>
                </div>
              </div>

              <div className="bg-indigo-500/15 border-2 border-indigo-500 rounded-xl p-6">
                <div className="text-xl font-bold text-indigo-400 mb-3">🤖 Agent Diagnosis</div>
                <div className="text-white/90 text-lg leading-relaxed">
                  "Kavita, your store is fine. I've detected a major downtime at Axis Bank UPI causing 40% failure rate."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROACTIVE RECOVERY */}
        <section
          ref={(el) => (sectionsRef.current[5] = el)}
          className="min-h-screen flex items-center justify-center p-16"
          style={{ background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.2) 0%, #000 70%)' }}
        >
          <div className={`max-w-2xl transition-all duration-1000 ${isVisible(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-3xl font-bold text-emerald-400 mb-12 text-center">
              This is the moment of truth.
            </p>

            {/* Recovery Card */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-700 rounded-2xl p-10 shadow-2xl">
              <div className="text-6xl mb-6">💡</div>
              <h3 className="text-3xl font-bold text-white mb-4">Agent Recommendation</h3>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                "I can save these sales. I've drafted a Multi-Method Payment Link that bypasses the broken UPI lane. Should I send it?"
              </p>
              <button className="bg-white text-emerald-700 px-10 py-4 rounded-xl text-lg font-bold hover:-translate-y-1 transition-transform shadow-xl">
                ✓ Send Recovery Link
              </button>
            </div>

            {/* Success Metric */}
            <div className="bg-emerald-500/15 border-4 border-emerald-400 rounded-2xl p-10 mt-10 text-center">
              <div className="text-7xl font-black text-emerald-400 mb-4"
                   style={{ textShadow: '0 0 40px rgba(16, 185, 129, 0.5)' }}>
                ₹5,000
              </div>
              <div className="text-2xl text-white/80 font-semibold">Agent-Recovered Revenue</div>
            </div>

            <p className="text-2xl italic text-white/80 mt-10 border-l-4 border-emerald-400 pl-8">
              "This isn't just analytics. This is money that would have been lost, captured by an intelligence that refused to give up."
            </p>
          </div>
        </section>

        {/* FINALE */}
        <section className="min-h-screen flex items-center justify-center p-16">
          <div className="text-center">
            <h2 className="text-8xl font-black mb-8"
                style={{
                  background: 'linear-gradient(135deg, #635BFF 0%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
              Razorpay
            </h2>
            <p className="text-4xl text-white/60 font-light">The Agentic Era</p>
            <p className="text-2xl text-white/40 mt-16 font-medium">
              Welcome to the future of business.
            </p>
          </div>
        </section>
      </div>

      {/* Right Panel: Prototype */}
      <div className="w-[60%] h-full overflow-hidden">
        <Dashboard
          initialConfig={{ view: 'home', variants: { home: 'B', transactions: 'A' } }}
          onLogout={() => {}}
          onSceneChange={handleSceneChange}
        />
      </div>
    </div>
  );
};

export default Presentation;

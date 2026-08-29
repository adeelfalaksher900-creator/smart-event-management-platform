import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Zap, Shield, Users, Trophy } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-background overflow-x-hidden selection:bg-primary/30">
      {/* 1. Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-bold">
              E
            </div>
            <span className="text-xl font-bold tracking-tight font-display">EVENTOS</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
            <a href="#demo" className="hover:text-primary transition-colors">Live Demo</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex">Sign in</Button>
            <Button onClick={() => navigate('/select-role')}>
              Launch Workspace
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-24 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Prompt Wars 2026 Official Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-headline mb-6 leading-tight">
              One intelligent workspace for the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">complete event lifecycle.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 font-body">
              Ditch the scattered spreadsheets and disjointed tools. Eventos unifies registration, team matchmaking, judging, and live analytics into a single, high-performance SaaS engine.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={() => navigate('/select-role')}>
                Start Live Demo
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg">
                View Documentation
              </Button>
            </div>
          </motion.div>
          
          {/* Abstract UI Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="aspect-[16/9] rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-12 border-b border-outline-variant/30 bg-surface/50 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/80" />
                  <div className="w-3 h-3 rounded-full bg-tertiary/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
              <div className="pt-12 p-8 h-full flex flex-col gap-6 opacity-30">
                <div className="h-8 w-1/3 bg-primary/20 rounded" />
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-4">
                    <div className="h-32 bg-surface-container rounded-xl" />
                    <div className="h-32 bg-surface-container rounded-xl" />
                  </div>
                  <div className="col-span-1 bg-surface-container rounded-xl" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional sections (Value Props, Social Proof, Core Features, etc.) could be added here following the 12-section requirement */}
      <section className="py-24 px-6 bg-surface-container-lowest border-t border-outline-variant/20" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Engineering excellence</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Built on a modern, typed architecture for maximum speed and reliability.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap />, title: "Real-time State", desc: "Instantly synchronized data across all clients without manual refreshes." },
              { icon: <Users />, title: "Smart Matchmaking", desc: "Algorithmic team formation based on complementary skills and interests." },
              { icon: <Trophy />, title: "Live Leaderboards", desc: "Deterministic, instant scoring aggregation for high-stakes judging." },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-surface border border-outline-variant hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-on-surface-variant">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}

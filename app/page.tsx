'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Brain, Heart, Activity } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F6F6F4]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-[#1A1A1A]">
                Mentoxy
              </span>
            </div>

            {/* Nav Links - Center */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-[14px] font-medium text-[#1A1A1A] hover:text-[#555555] transition-colors">
                Home
              </Link>
              <Link href="#about" className="text-[14px] font-medium text-[#1A1A1A] hover:text-[#555555] transition-colors">
                About Us
              </Link>
              <Link href="#benefits" className="text-[14px] font-medium text-[#1A1A1A] hover:text-[#555555] transition-colors">
                Benefit
              </Link>
              <Link href="#community" className="text-[14px] font-medium text-[#1A1A1A] hover:text-[#555555] transition-colors">
                Community
              </Link>
            </div>

            {/* Contact Button - Right */}
            <Button className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-full px-6 py-2.5 text-[14px] font-medium transition-all">
              Contact Us <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&q=80"
            alt="Calm water texture"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F6F4]/95 via-[#F6F6F4]/90 to-[#F6F6F4]"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Main Headline */}
            <h1 className="text-[54px] leading-tight font-serif font-bold text-[#1A1A1A] mb-6">
              Your Path to Mental Wellness
              <br />
              Starts Here
            </h1>

            {/* Supporting Text */}
            <p className="text-[18px] text-[#555555] mb-12 max-w-2xl mx-auto leading-relaxed">
              Track your emotional well-being, understand your sleep patterns, and gain insights
              into your mental health with science-backed analytics and personalized guidance.
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-full px-10 py-6 text-[16px] font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Journey <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 3-Card Metrics Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sleep Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredCard(0)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative h-[420px] rounded-[24px] overflow-hidden cursor-pointer group"
              style={{
                transform: hoveredCard === 0 ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Background Image */}
              <Image
                src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80"
                alt="Person sleeping peacefully"
                fill
                className="object-cover brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 glass-card-overlay"></div>

              {/* Glass Card Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between glass-card">
                <div>
                  <h3 className="text-[28px] font-serif font-bold text-white mb-2">Sleep</h3>
                  <p className="text-white/80 text-[14px]">Quality Rest Analysis</p>
                </div>

                {/* Chart Visual */}
                <div className="relative h-32 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 300 120">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                    {/* Line chart */}
                    <polyline
                      points="0,80 50,60 100,70 150,40 200,50 250,35 300,45"
                      fill="none"
                      stroke="#A9D2FF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dots */}
                    {[0, 50, 100, 150, 200, 250, 300].map((x, i) => {
                      const y = [80, 60, 70, 40, 50, 35, 45][i];
                      return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#7CB8F6" />
                      );
                    })}
                  </svg>
                </div>

                {/* Caption */}
                <p className="text-white/90 text-[13px] leading-relaxed">
                  Average 7.2 hours per night with 85% deep sleep quality
                </p>
              </div>
            </motion.div>

            {/* Biomarkers Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredCard(1)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative h-[420px] rounded-[24px] overflow-hidden cursor-pointer group"
              style={{
                transform: hoveredCard === 1 ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Background Image */}
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                alt="Wellness and health"
                fill
                className="object-cover brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 glass-card-overlay"></div>

              {/* Glass Card Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between glass-card">
                <div>
                  <h3 className="text-[28px] font-serif font-bold text-white mb-2">Biomarkers</h3>
                  <p className="text-white/80 text-[14px]">Health Indicators</p>
                </div>

                {/* Bar Chart Visual */}
                <div className="relative h-32 mb-4 flex items-end gap-3 px-4">
                  {[65, 85, 72, 90, 68, 78, 82].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-[#4F8EF0] to-[#A9D2FF]"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>

                {/* Caption */}
                <p className="text-white/90 text-[13px] leading-relaxed">
                  All markers within optimal range. Cortisol trending positive.
                </p>
              </div>
            </motion.div>

            {/* HRV Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredCard(2)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative h-[420px] rounded-[24px] overflow-hidden cursor-pointer group"
              style={{
                transform: hoveredCard === 2 ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Background Image */}
              <Image
                src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80"
                alt="Meditation and mindfulness"
                fill
                className="object-cover brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 glass-card-overlay"></div>

              {/* Glass Card Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between glass-card">
                <div>
                  <h3 className="text-[28px] font-serif font-bold text-white mb-2">HRV</h3>
                  <p className="text-white/80 text-[14px]">Heart Rate Variability</p>
                </div>

                {/* Wave Chart Visual */}
                <div className="relative h-32 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 300 120">
                    {/* Grid */}
                    <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                    {/* Smooth wave pattern */}
                    <path
                      d="M0,60 Q25,30 50,60 T100,60 T150,60 T200,60 T250,60 T300,60"
                      fill="none"
                      stroke="#7CB8F6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0,60 Q25,85 50,60 T100,60 T150,60 T200,60 T250,60 T300,60"
                      fill="none"
                      stroke="#A9D2FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.6"
                    />

                    {/* Key points */}
                    <circle cx="50" cy="60" r="5" fill="#4F8EF0" />
                    <circle cx="150" cy="60" r="5" fill="#4F8EF0" />
                    <circle cx="250" cy="60" r="5" fill="#4F8EF0" />
                  </svg>
                </div>

                {/* Caption */}
                <p className="text-white/90 text-[13px] leading-relaxed">
                  Optimal variability at 68ms. Stress resilience improving.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-[42px] font-serif font-bold text-[#1A1A1A] mb-6">
              Science-Backed Mental Wellness
            </h2>
            <p className="text-[18px] text-[#555555] max-w-3xl mx-auto leading-relaxed">
              Mentoxy combines advanced biometric tracking with evidence-based psychology
              to provide personalized insights into your mental and emotional well-being.
              Our platform helps you understand the connection between your daily habits,
              physiological markers, and mental health.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Brain, title: 'Cognitive Analytics', desc: 'Track mental clarity, focus, and cognitive performance over time' },
              { icon: Heart, title: 'Emotional Balance', desc: 'Monitor mood patterns and emotional regulation metrics' },
              { icon: Activity, title: 'Physical Wellness', desc: 'Connect physical health data with mental well-being' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
                className="glass-card rounded-[20px] p-8 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[22px] font-serif font-bold text-[#1A1A1A] mb-3">
                  {item.title}
                </h3>
                <p className="text-[15px] text-[#555555] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-serif font-bold text-[#1A1A1A]">
                Mentoxy
              </span>
            </div>
            <div className="flex gap-8 text-[14px] text-[#555555]">
              <Link href="#about" className="hover:text-[#1A1A1A] transition-colors">About</Link>
              <Link href="#privacy" className="hover:text-[#1A1A1A] transition-colors">Privacy</Link>
              <Link href="#terms" className="hover:text-[#1A1A1A] transition-colors">Terms</Link>
              <Link href="#contact" className="hover:text-[#1A1A1A] transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-[13px] text-[#555555]">
            © 2025 Mentoxy. Your trusted companion for mental wellness.
          </div>
        </div>
      </footer>
    </div>
  );
}

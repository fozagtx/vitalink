'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  FileText,
  Upload,
  Search,
  ChartBar,
  Activity,
  TrendingUp,
  AlertCircle,
  Clock,
  MapPin,
  Scale
} from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      const documentId = `doc-${Date.now()}`;
      const tempData = {
        fileName: file.name,
        fileData: base64,
        fileSize: file.size,
        documentId: documentId
      };

      localStorage.setItem(`document-${documentId}`, JSON.stringify(tempData));
      router.push(`/results/${documentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDF');
      setLoading(false);
    }
  };

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
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80"
            alt="Medical background"
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
              Understand Your Health Reports
              <br />
              in Seconds
            </h1>

            {/* Supporting Text */}
            <p className="text-[18px] text-[#555555] mb-12 max-w-2xl mx-auto leading-relaxed">
              AI-powered medical report analysis with clear explanations and auto-generated health visuals.
              Transform complex lab results into insights you can actually understand.
            </p>

            {/* Upload Section */}
            <div className="max-w-xl mx-auto mb-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer group"
              >
                <div className="glass-card rounded-[20px] p-12 hover:shadow-lg transition-all border-2 border-dashed border-white/50 hover:border-[#1A1A1A]/30">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-[#1A1A1A]" />
                  <p className="text-lg font-serif font-semibold text-[#1A1A1A] mb-2">
                    {file ? file.name : 'Upload Medical Report'}
                  </p>
                  <p className="text-sm text-[#555555]">
                    PDF format • Blood tests, prescriptions, lab results
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={!file || loading}
                size="lg"
                className="mt-6 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-full px-10 py-6 text-[16px] font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Report...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Analyze Now
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3-Card Metrics Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Blood Sugar Card */}
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
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                alt="Blood test analysis"
                fill
                className="object-cover brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 glass-card-overlay"></div>

              {/* Glass Card Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between glass-card">
                <div>
                  <h3 className="text-[28px] font-serif font-bold text-white mb-2">Blood Sugar</h3>
                  <p className="text-white/80 text-[14px]">Glucose Monitoring</p>
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
                  Track blood sugar levels and identify patterns over time
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
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80"
                alt="Lab test results"
                fill
                className="object-cover brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 glass-card-overlay"></div>

              {/* Glass Card Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between glass-card">
                <div>
                  <h3 className="text-[28px] font-serif font-bold text-white mb-2">Biomarkers</h3>
                  <p className="text-white/80 text-[14px]">Lab Test Analysis</p>
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
                  Visualize cholesterol, vitamins, and other key health markers
                </p>
              </div>
            </motion.div>

            {/* Vital Signs Card */}
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
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80"
                alt="Health monitoring"
                fill
                className="object-cover brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 glass-card-overlay"></div>

              {/* Glass Card Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between glass-card">
                <div>
                  <h3 className="text-[28px] font-serif font-bold text-white mb-2">Vital Signs</h3>
                  <p className="text-white/80 text-[14px]">Health Monitoring</p>
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
                  Monitor heart rate, blood pressure, and respiratory health
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[42px] font-serif font-bold text-[#1A1A1A] mb-4">
              How It Works
            </h2>
            <p className="text-[18px] text-[#555555]">
              Three simple steps to clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: 'Upload Report', desc: 'Drop your PDF medical report, lab results, or blood test' },
              { icon: Search, title: 'AI Analyzes', desc: 'Our advanced AI reads and interprets your results in seconds' },
              { icon: ChartBar, title: 'Get Insights + Visuals', desc: 'Receive clear explanations with interactive charts and graphics' }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
                className="glass-card rounded-[20px] p-8 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[22px] font-serif font-bold text-[#1A1A1A] mb-3">
                  {i + 1}. {step.title}
                </h3>
                <p className="text-[15px] text-[#555555] leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mentoxy */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-[42px] font-serif font-bold text-[#1A1A1A] mb-6">
              Why Mentoxy?
            </h2>
            <p className="text-[18px] text-[#555555] max-w-3xl mx-auto leading-relaxed">
              Transform complex medical documents into clear, visual insights. Our AI-powered platform
              helps you understand your health data with science-backed analysis and easy-to-read visualizations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: 'Clear Explanations', desc: 'No medical jargon, just simple language you can understand' },
              { icon: Activity, title: 'Visual Analytics', desc: 'Auto-generated charts and graphs for every metric' },
              { icon: TrendingUp, title: 'Track Progress', desc: 'Monitor your health trends and improvements over time' }
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

      {/* Quick Access Tools */}
      <section className="py-20 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[42px] font-serif font-bold text-[#1A1A1A] mb-4">
              Quick Access Tools
            </h2>
            <p className="text-[18px] text-[#555555]">
              Essential healthcare tools at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Find Care Near You Card */}
            <Link href="/nearby-care">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group glass-card rounded-[20px] p-8 hover:shadow-lg transition-all cursor-pointer h-full"
              >
                <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-[28px] font-serif font-bold text-[#1A1A1A] mb-3">
                  Find Care Near You
                </h3>
                <p className="text-[#555555] leading-relaxed mb-4">
                  Locate the closest hospitals, clinics, and pharmacies instantly using your location.
                </p>
                <div className="inline-flex items-center text-[#1A1A1A] font-semibold group-hover:gap-3 gap-2 transition-all">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>

            {/* BMI Calculator Card */}
            <Link href="/bmi">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="group glass-card rounded-[20px] p-8 hover:shadow-lg transition-all cursor-pointer h-full"
              >
                <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-[28px] font-serif font-bold text-[#1A1A1A] mb-3">
                  BMI Calculator
                </h3>
                <p className="text-[#555555] leading-relaxed mb-4">
                  Calculate your Body Mass Index and understand your health metrics.
                </p>
                <div className="inline-flex items-center text-[#1A1A1A] font-semibold group-hover:gap-3 gap-2 transition-all">
                  Calculate Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
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
            © 2025 Mentoxy. Transforming medical reports into clarity.
          </div>
        </div>
      </footer>
    </div>
  );
}

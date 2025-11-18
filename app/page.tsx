'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              V
            </div>
            <span className="text-2xl font-bold text-gray-900">
              VitalView AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/nearby-care" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Find Care
            </Link>
            <Link href="/bmi" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              BMI Calculator
            </Link>
            <Link href="#upload" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Upload Report
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg px-6">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200 rounded-full px-6 py-3 mb-8 shadow-sm">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm font-medium text-blue-600">Powered by Advanced Medical AI</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Understand Your Health
              <br />
              <span className="text-blue-600">
                in Seconds
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              AI-powered medical report analysis with clear explanations and auto-generated health visuals.
              Transform complex lab results into insights you can actually understand.
            </p>

            {/* Upload Section in Hero */}
            <div className="max-w-xl mx-auto">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer group"
              >
                <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {file ? file.name : 'Upload Medical Report'}
                  </p>
                  <p className="text-sm text-gray-500">
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
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={!file || loading}
                size="lg"
                className="mt-6 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg px-12 py-7 text-lg font-semibold shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="mr-2 animate-spin">⏳</span>
                    Analyzing Your Report...
                  </>
                ) : (
                  <>
                    Analyze Now
                  </>
                )}
              </Button>
            </div>

            {/* Sample Visuals Carousel */}
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              {['Blood Sugar Chart', 'Cholesterol Analysis', 'Vitamin D Status'].map((label, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 * i }}
                  className="bg-white border border-gray-200 rounded-lg px-6 py-4 flex items-center gap-3 shadow-sm"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    {['📊', '💉', '💊'][i]}
                  </div>
                  <span className="font-medium text-gray-900">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📤', title: 'Upload Report', desc: 'Drop your PDF medical report, lab results, or blood test' },
              { icon: '🤖', title: 'AI Analyzes', desc: 'Our advanced AI reads and interprets your results in seconds' },
              { icon: '📊', title: 'Get Insights + Visuals', desc: 'Receive clear explanations with interactive charts and graphics' }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-blue-300 transition-all">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-3xl mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll See */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What You'll See
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive insights tailored to you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📋', title: 'Your Health Summary', desc: 'Top findings in plain English' },
              { icon: '⚠️', title: 'Key Problems Identified', desc: 'What needs attention' },
              { icon: '📈', title: 'Visual Insights', desc: 'Charts, graphs, test tubes' },
              { icon: '💡', title: 'Actionable Advice', desc: 'Daily steps you can take' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-blue-300 transition-all group cursor-pointer"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-200 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Visual Analysis */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-xl p-12 shadow-lg"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                We Turn Lab Numbers Into Visuals
              </h2>
              <p className="text-gray-600">
                Example: Blood Sugar Analysis
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Glucose Level</div>
                  <div className="text-4xl font-bold text-blue-600">145 mg/dL</div>
                </div>
                <div className="text-6xl">🩸</div>
              </div>

              {/* Placeholder chart */}
              <div className="h-48 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="text-5xl mb-2">📊</div>
                  <div className="text-gray-500 font-medium">Interactive Chart Preview</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-600">What this means:</strong> Your glucose is slightly elevated. Consider reducing sugar intake and increasing physical activity.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why VitalView AI */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why VitalView AI?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💬', title: 'Clear Explanations', desc: 'No medical jargon, just simple language' },
              { icon: '🎨', title: 'AI-Powered Visuals', desc: 'Automatic charts and graphics' },
              { icon: '🔒', title: 'Private & Secure', desc: 'Your data stays on your device' },
              { icon: '👨‍⚕️', title: 'Doctor-Friendly', desc: 'Share with your healthcare provider' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Tools */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Quick Access Tools
            </h2>
            <p className="text-xl text-gray-600">
              Essential healthcare tools at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Find Care Near You Card */}
            <Link href="/nearby-care">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer h-full"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-4xl mb-6 group-hover:bg-blue-700 transition-colors">
                    📍
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Find Care Near You
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Locate the closest hospitals, clinics, and pharmacies instantly using your location.
                  </p>
                  <div className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                    Get Started
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
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
                className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer h-full"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-4xl mb-6 group-hover:bg-blue-700 transition-colors">
                    📏
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    BMI Calculator
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Calculate your Body Mass Index and understand your health metrics.
                  </p>
                  <div className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                    Calculate Now
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Coming Soon Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-8 opacity-60 h-full"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center text-4xl mb-6">
                  💊
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Medication Tracker
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Track your prescriptions and get reminders. Coming soon!
                </p>
                <div className="inline-flex items-center text-gray-500 font-semibold gap-2">
                  Coming Soon
                  <span className="text-xl">⏳</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="upload" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-blue-600 rounded-xl p-12 text-center text-white shadow-xl"
          >
            <h2 className="text-4xl font-bold mb-4 relative z-10">
              Ready to Understand Your Medical Report?
            </h2>
            <p className="text-xl mb-8 opacity-90 relative z-10">
              Get started in seconds. No signup required.
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-lg px-12 py-7 text-lg font-semibold shadow-lg relative z-10"
            >
              Upload Your Report
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                V
              </div>
              <span className="text-xl font-bold text-gray-900">
                VitalView AI
              </span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <Link href="#about" className="hover:text-blue-600 transition-colors">About</Link>
              <Link href="#privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
              <Link href="#terms" className="hover:text-blue-600 transition-colors">Terms</Link>
              <Link href="#contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2025 VitalView AI. Transforming medical reports into clarity.
          </div>
        </div>
      </footer>
    </div>
  );
}

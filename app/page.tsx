'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Upload,
  Search,
  ChartBar,
  Lightbulb,
  Shield,
  Users,
  MessageSquare,
  Activity,
  MapPin,
  Scale,
  Pill,
  Hospital,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-lg">
              V
            </div>
            <span className="text-2xl font-bold text-foreground">
              VitalView AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link href="/nearby-care" className="text-foreground hover:text-primary transition-colors font-medium">
              Find Care
            </Link>
            <Link href="/bmi" className="text-foreground hover:text-primary transition-colors font-medium">
              BMI Calculator
            </Link>
            <Link href="#upload" className="text-foreground hover:text-primary transition-colors font-medium">
              Upload Report
            </Link>
            <Button className="bg-primary hover:bg-primary/90 px-6">
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
            <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded px-4 py-2 mb-8">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by Advanced Medical AI</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Understand Your Health
              <br />
              <span className="text-primary">
                in Seconds
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              AI-powered medical report analysis with clear explanations and auto-generated health visuals.
              Transform complex lab results into insights you can actually understand.
            </p>

            {/* Upload Section in Hero */}
            <div className="max-w-xl mx-auto">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer group"
              >
                <div className="relative bg-white border-2 border-dashed border-border rounded-lg p-12 hover:border-primary transition-all hover:shadow-md">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-semibold text-foreground mb-2">
                    {file ? file.name : 'Upload Medical Report'}
                  </p>
                  <p className="text-sm text-muted-foreground">
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
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded text-destructive text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={!file || loading}
                size="lg"
                className="mt-6 w-full md:w-auto bg-primary hover:bg-primary/90 px-12 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Your Report...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze Now
                  </>
                )}
              </Button>
            </div>

            {/* Sample Visuals Carousel */}
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              {[
                { label: 'Blood Sugar Chart', icon: ChartBar },
                { label: 'Cholesterol Analysis', icon: Activity },
                { label: 'Vitamin D Status', icon: TrendingUp }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 * i }}
                  className="bg-secondary border border-border rounded-lg px-6 py-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-primary-foreground">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
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
                className="relative"
              >
                <div className="bg-white border border-border rounded-lg p-8 hover:shadow-lg hover:border-primary/50 transition-all">
                  <div className="w-16 h-16 bg-primary rounded flex items-center justify-center mb-6">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll See */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What You'll See
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive insights tailored to you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: 'Your Health Summary', desc: 'Top findings in plain English' },
              { icon: AlertCircle, title: 'Key Problems Identified', desc: 'What needs attention' },
              { icon: ChartBar, title: 'Visual Insights', desc: 'Charts, graphs, test tubes' },
              { icon: Lightbulb, title: 'Actionable Advice', desc: 'Daily steps you can take' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
                className="bg-white border border-border rounded-lg p-8 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-14 h-14 bg-secondary rounded flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <item.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Visual Analysis */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-border rounded-lg p-12 shadow-sm"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                We Turn Lab Numbers Into Visuals
              </h2>
              <p className="text-muted-foreground">
                Example: Blood Sugar Analysis
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-8 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Glucose Level</div>
                  <div className="text-4xl font-bold text-primary">145 mg/dL</div>
                </div>
                <Activity className="w-16 h-16 text-primary" />
              </div>

              {/* Placeholder chart */}
              <div className="h-48 bg-white rounded-lg flex items-center justify-center border border-border">
                <div className="text-center">
                  <ChartBar className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-muted-foreground font-medium">Interactive Chart Preview</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-border">
                <p className="text-sm text-foreground">
                  <strong className="text-primary">What this means:</strong> Your glucose is slightly elevated. Consider reducing sugar intake and increasing physical activity.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why VitalView AI */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why VitalView AI?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageSquare, title: 'Clear Explanations', desc: 'No medical jargon, just simple language' },
              { icon: ChartBar, title: 'AI-Powered Visuals', desc: 'Automatic charts and graphics' },
              { icon: Shield, title: 'Private & Secure', desc: 'Your data stays on your device' },
              { icon: Users, title: 'Doctor-Friendly', desc: 'Share with your healthcare provider' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
                className="bg-white border border-border rounded-lg p-8 hover:shadow-md transition-all"
              >
                <feature.icon className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Tools */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Quick Access Tools
            </h2>
            <p className="text-xl text-muted-foreground">
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
                className="group bg-white border-2 border-border rounded-lg p-8 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full"
              >
                <div className="w-16 h-16 bg-primary rounded flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <MapPin className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Find Care Near You
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Locate the closest hospitals, clinics, and pharmacies instantly using your location.
                </p>
                <div className="inline-flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all">
                  Get Started
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
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
                className="group bg-white border-2 border-border rounded-lg p-8 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full"
              >
                <div className="w-16 h-16 bg-primary rounded flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Scale className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  BMI Calculator
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Calculate your Body Mass Index and understand your health metrics.
                </p>
                <div className="inline-flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all">
                  Calculate Now
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            </Link>

            {/* Coming Soon Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-border rounded-lg p-8 opacity-60 h-full"
            >
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center mb-6">
                <Pill className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Medication Tracker
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Track your prescriptions and get reminders. Coming soon!
              </p>
              <div className="inline-flex items-center text-muted-foreground font-semibold gap-2">
                Coming Soon
                <Clock className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="upload" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary rounded-lg p-12 text-center text-primary-foreground shadow-lg"
          >
            <Hospital className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Understand Your Medical Report?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get started in seconds. No signup required.
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="bg-white text-primary hover:bg-secondary px-12"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Your Report
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-lg">
                V
              </div>
              <span className="text-xl font-bold text-foreground">
                VitalView AI
              </span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#about" className="hover:text-primary transition-colors">About</Link>
              <Link href="#privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2025 VitalView AI. Transforming medical reports into clarity.
          </div>
        </div>
      </footer>
    </div>
  );
}

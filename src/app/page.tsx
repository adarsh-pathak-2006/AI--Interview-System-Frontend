import Link from "next/link";
import { ArrowRight, BrainCircuit, Code, Target } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      
      {/* Hero Section */}
      <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-emerald-400 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          AI Interview Platform is Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Master Your Next <br />
          <span className="text-gradient">Technical Interview</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Experience hyper-realistic technical interviews powered by OpenRouter AI. 
          Upload your resume, answer dynamic questions, and get actionable feedback instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25">
            Start Practicing Now <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl glass glass-hover text-white font-semibold flex items-center justify-center gap-2">
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mt-32 w-full">
        <FeatureCard 
          icon={<BrainCircuit className="w-8 h-8 text-indigo-400" />}
          title="AI-Driven Logic"
          description="Questions are dynamically generated based on your unique resume and project portfolio."
        />
        <FeatureCard 
          icon={<Code className="w-8 h-8 text-emerald-400" />}
          title="Technical Depth"
          description="From system design to deep language specifics, the AI acts as a senior engineer."
        />
        <FeatureCard 
          icon={<Target className="w-8 h-8 text-purple-400" />}
          title="Actionable Feedback"
          description="Get scored out of 10 for every answer, complete with strengths and missing skills."
        />
      </div>

    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass glass-hover p-8 rounded-2xl flex flex-col items-center text-center gap-4">
      <div className="p-4 bg-white/5 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

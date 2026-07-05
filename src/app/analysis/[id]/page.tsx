"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/api/axiosClient";
import { Loader2, ArrowLeft, Trophy, AlertTriangle, Target, Briefcase } from "lucide-react";
import Link from "next/link";

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const res = await apiClient.get(`/ai/interview/${params.id}/`);
      setInterview(res.data);
    } catch (err) {
      console.error(err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex-center min-h-screen"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
  if (!interview || !interview.analysis) return <div className="flex-center min-h-screen">Analysis not ready yet.</div>;

  const analysis = interview.analysis;

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
        
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold border border-indigo-500/30">
            Interview Complete
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-8">Performance <span className="text-gradient">Analysis</span></h1>

        {/* Scores Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreCard title="Overall Score" score={analysis.scores?.overall || 0} icon={<Trophy className="text-amber-400 w-8 h-8" />} />
          <ScoreCard title="Technical Depth" score={analysis.scores?.technical || 0} icon={<CodeIcon className="text-emerald-400 w-8 h-8" />} />
          <ScoreCard title="Communication" score={analysis.scores?.communication || 0} icon={<ChatIcon className="text-blue-400 w-8 h-8" />} />
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Strengths */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
              <Trophy className="w-5 h-5" /> Key Strengths
            </h3>
            <ul className="space-y-3">
              {analysis.strengths?.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-emerald-500">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" /> Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {analysis.weaknesses?.map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-rose-500">•</span> {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
              <Target className="w-5 h-5" /> Missing Skills Detected
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.missing_skills?.map((skill: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Suggested Roles */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
              <Briefcase className="w-5 h-5" /> Suggested Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.suggested_roles?.map((role: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full text-sm">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="glass p-8 rounded-2xl mt-8 border-indigo-500/30">
          <h3 className="text-xl font-bold mb-4 text-indigo-400">Executive Summary</h3>
          <p className="text-gray-300 leading-relaxed text-lg">
            {analysis.overall_feedback}
          </p>
        </div>

      </div>
    </main>
  );
}

function ScoreCard({ title, score, icon }: { title: string, score: number, icon: any }) {
  return (
    <div className="glass p-6 rounded-2xl flex items-center gap-6">
      <div className="p-4 bg-black/40 rounded-full border border-white/5">
        {icon}
      </div>
      <div>
        <div className="text-gray-400 text-sm font-medium mb-1">{title}</div>
        <div className="text-3xl font-bold">{score}/10</div>
      </div>
    </div>
  );
}

// Dummy icons
const CodeIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const ChatIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/api/axiosClient";
import { Plus, Play, FileText, Briefcase, Loader2, LogOut } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Resume Form
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [summary, setSummary] = useState("");
  const [course, setCourse] = useState("");
  const [college, setCollege] = useState("");
  const [cgpa, setCgpa] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await apiClient.get("/auth/resume/");
      setResumes(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/resume/", {
        summary, course, college, cgpa: parseFloat(cgpa)
      });
      setShowResumeForm(false);
      fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  const startInterview = async (resumeId: number) => {
    try {
      const res = await apiClient.post("/ai/start/", { resume_id: resumeId });
      router.push(`/interview/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
        <button onClick={handleLogout} className="text-gray-400 hover:text-white flex items-center gap-2">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center space-y-6">
          <div className="bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold">Create Your Profile</h2>
          <p className="text-gray-400 max-w-md mx-auto">We need some background information before the AI can generate personalized technical interview questions.</p>
          
          {!showResumeForm ? (
            <button onClick={() => setShowResumeForm(true)} className="btn">
              <Plus className="w-5 h-5" /> Add Resume Details
            </button>
          ) : (
            <form onSubmit={handleCreateResume} className="max-w-md mx-auto text-left space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <textarea placeholder="Professional Summary" value={summary} onChange={e => setSummary(e.target.value)} required rows={4} />
              <input type="text" placeholder="Course / Degree" value={course} onChange={e => setCourse(e.target.value)} required />
              <input type="text" placeholder="College / University" value={college} onChange={e => setCollege(e.target.value)} required />
              <input type="number" step="0.1" placeholder="CGPA" value={cgpa} onChange={e => setCgpa(e.target.value)} required />
              <div className="flex gap-4">
                <button type="submit" className="btn flex-1">Save Profile</button>
                <button type="button" onClick={() => setShowResumeForm(false)} className="btn btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resumes.map(resume => (
            <div key={resume.id} className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Briefcase className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{resume.course}</h3>
              <p className="text-indigo-400 mb-4">{resume.college} • {resume.cgpa} CGPA</p>
              <p className="text-gray-400 mb-6 text-sm line-clamp-3">{resume.summary}</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => startInterview(resume.id)}
                  className="btn bg-emerald-600 hover:bg-emerald-500"
                >
                  <Play className="w-4 h-4" /> Start Interview
                </button>
                <button className="btn btn-secondary text-sm px-4">
                  Manage Projects ({resume.projects?.length || 0})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

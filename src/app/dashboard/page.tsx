"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/api/axiosClient";
import { Plus, Play, FileText, Briefcase, Loader2, LogOut, X } from "lucide-react";

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

  // Projects Modal
  const [activeProjectResumeId, setActiveProjectResumeId] = useState<number | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectGithub, setProjectGithub] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await apiClient.get("/auth/resume/");
      setResumes(res.data);
    } catch (err: any) {
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

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/project/", {
        resume_id: activeProjectResumeId,
        name: projectName,
        description: projectDesc,
        github: projectGithub
      });
      setProjectName("");
      setProjectDesc("");
      setProjectGithub("");
      setIsAddingProject(false);
      fetchResumes();
    } catch (err: any) {
      console.error(err.response?.data || err);
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
    <main className="min-h-screen p-8 max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
        <button onClick={handleLogout} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center space-y-6">
          <div className="bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold">Create Your Profile</h2>
          <p className="text-gray-400 max-w-md mx-auto">We need some background information before the AI can generate personalized technical interview questions.</p>
          
          {!showResumeForm ? (
            <button onClick={() => setShowResumeForm(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto transition-all">
              <Plus className="w-5 h-5" /> Add Resume Details
            </button>
          ) : (
            <form onSubmit={handleCreateResume} className="max-w-md mx-auto text-left space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <textarea placeholder="Professional Summary" value={summary} onChange={e => setSummary(e.target.value)} required rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              <input type="text" placeholder="Course / Degree" value={course} onChange={e => setCourse(e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              <input type="text" placeholder="College / University" value={college} onChange={e => setCollege(e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              <input type="number" step="0.1" placeholder="CGPA" value={cgpa} onChange={e => setCgpa(e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all">Save Profile</button>
                <button type="button" onClick={() => setShowResumeForm(false)} className="flex-1 py-3 glass glass-hover rounded-xl font-semibold transition-all">Cancel</button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resumes.map(resume => (
            <div key={resume.id} className="glass rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Briefcase className="w-24 h-24 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{resume.course}</h3>
              <p className="text-indigo-400 mb-4">{resume.college} • {resume.cgpa} CGPA</p>
              <p className="text-gray-400 mb-6 text-sm line-clamp-3 leading-relaxed">{resume.summary}</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => startInterview(resume.id)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Interview
                </button>
                <button 
                  onClick={() => setActiveProjectResumeId(resume.id)}
                  className="px-6 py-3 glass glass-hover rounded-xl font-semibold text-sm transition-all"
                >
                  Manage Projects ({resume.projects?.length || 0})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects Modal */}
      {activeProjectResumeId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-8 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => {
                setActiveProjectResumeId(null);
                setIsAddingProject(false);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gradient inline-block">Manage Projects</h2>
            
            {(() => {
              const r = resumes.find(r => r.id === activeProjectResumeId);
              return (
                <div className="space-y-6">
                  {r?.projects?.length > 0 ? (
                    <div className="space-y-4">
                      {r.projects.map((p: any) => (
                        <div key={p.id} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-indigo-500/30 transition-colors">
                          <h4 className="font-bold text-lg">{p.name}</h4>
                          {p.github && <p className="text-sm font-semibold text-indigo-300 mb-3">{p.github}</p>}
                          <p className="text-sm text-gray-400 leading-relaxed">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No projects added yet.</p>
                  )}

                  {!isAddingProject ? (
                    <button 
                      onClick={() => setIsAddingProject(true)} 
                      className="px-6 py-4 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all w-full"
                    >
                      <Plus className="w-5 h-5" /> Add New Project
                    </button>
                  ) : (
                    <form onSubmit={handleAddProject} className="bg-black/30 p-6 rounded-xl border border-white/10 space-y-4 animate-in slide-in-from-top-2">
                      <input type="text" placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                      <input type="text" placeholder="GitHub Link (optional)" value={projectGithub} onChange={e => setProjectGithub(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                      <textarea placeholder="Describe the project and your role..." value={projectDesc} onChange={e => setProjectDesc(e.target.value)} required rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all" />
                      <div className="flex gap-4 pt-2">
                        <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all">Save Project</button>
                        <button type="button" onClick={() => setIsAddingProject(false)} className="flex-1 py-3 glass glass-hover rounded-xl font-semibold transition-all">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}

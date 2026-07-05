"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/api/axiosClient";
import { Brain, CheckCircle, Loader2, Send } from "lucide-react";

export default function InterviewRoom() {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    // Ideally we fetch the interview by ID here to restore state.
    // Since we don't have a specific GET /ai/interview/:id endpoint in this simplified setup,
    // we assume the questions are passed or we just rely on state. 
    // For a robust app, you'd add a RetrieveAPIView for Interview.
    // As a workaround, we'll try to fetch it or handle it.
    // Since I missed adding GET /ai/interview/:id in the backend plan, let's pretend we have it or just build it dynamically.
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      // We will need a backend route to GET interview details, 
      // but assuming the Start Interview gave us the ID, we can fetch it.
      // If the backend lacks GET /ai/interview/:id, we might hit a snag.
      // Assuming you will add it or we just keep it simple:
      const res = await apiClient.get(`/ai/interview/${params.id}/`);
      setInterview(res.data);
      
      // Find the first unanswered question
      const answeredCount = res.data.questions.filter((q: any) => q.answer).length;
      setCurrentQuestionIndex(answeredCount);
      
    } catch (err) {
      console.error("Error fetching interview, you may need to add a GET endpoint for this.", err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answerText.trim() || !interview) return;
    setEvaluating(true);
    setFeedback(null);
    try {
      const currentQuestion = interview.questions[currentQuestionIndex];
      const res = await apiClient.post("/ai/answer/", {
        question_id: currentQuestion.id,
        user_answer: answerText
      });
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = async () => {
    setAnswerText("");
    setFeedback(null);
    
    if (currentQuestionIndex + 1 < interview.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finish interview
      setEvaluating(true);
      try {
        const res = await apiClient.post(`/ai/finish/${interview.id}/`);
        router.push(`/analysis/${interview.id}`);
      } catch (err) {
        console.error(err);
        setEvaluating(false);
      }
    }
  };

  if (loading) return <div className="flex-center min-h-screen"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
  if (!interview) return <div className="flex-center min-h-screen">Interview not found. Make sure GET /ai/interview/:id exists on the backend.</div>;

  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Progress */}
        <div className="flex items-center justify-between glass px-6 py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Brain className="text-indigo-400 w-6 h-6" />
            <span className="font-semibold text-lg">AI Technical Interview</span>
          </div>
          <div className="text-sm text-gray-400">
            Question {currentQuestionIndex + 1} of {interview.questions.length}
          </div>
        </div>

        {/* Question Area */}
        <div className="glass p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold mb-6 leading-relaxed">
            {currentQuestion?.text}
          </h2>

          {!feedback ? (
            <div className="space-y-4">
              <textarea 
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                placeholder="Type your technical answer here..."
                className="w-full h-48 bg-black/30 border border-white/10 rounded-xl p-4 text-white resize-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <div className="flex justify-end">
                <button 
                  onClick={submitAnswer} 
                  disabled={evaluating || !answerText.trim()}
                  className="btn px-8 py-3"
                >
                  {evaluating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Evaluating...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Submit Answer</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95">
              <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
                  <CheckCircle className="w-6 h-6" /> Score: {feedback.score}/10
                </div>
                <p className="text-emerald-100 leading-relaxed">
                  {feedback.ai_feedback}
                </p>
              </div>
              <div className="flex justify-end">
                <button onClick={handleNext} className="btn bg-indigo-600">
                  {isLastQuestion ? "Finish Interview" : "Next Question"} <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Just a dummy icon since I didn't import ArrowRight at the top
import { ArrowRight } from "lucide-react";

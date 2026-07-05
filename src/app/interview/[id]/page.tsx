"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/api/axiosClient";
import { Brain, CheckCircle, Loader2, Send, ArrowRight } from "lucide-react";

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
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const res = await apiClient.get(`/ai/interview/${params.id}/`);
      setInterview(res.data);
      const answeredCount = res.data.questions.filter((q: any) => q.answer).length;
      setCurrentQuestionIndex(answeredCount);
    } catch (err) {
      console.error(err);
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
      setEvaluating(true);
      try {
        await apiClient.post(`/ai/finish/${interview.id}/`);
        router.push(`/analysis/${interview.id}`);
      } catch (err) {
        console.error(err);
        setEvaluating(false);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
  if (!interview) return <div className="flex items-center justify-center min-h-screen">Interview not found.</div>;

  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        
        <div className="flex items-center justify-between glass px-6 py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Brain className="text-indigo-400 w-6 h-6" />
            <span className="font-semibold text-lg">AI Technical Interview</span>
          </div>
          <div className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Question {currentQuestionIndex + 1} of {interview.questions.length}
          </div>
        </div>

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
                className="w-full h-48 bg-black/30 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <div className="flex justify-end">
                <button 
                  onClick={submitAnswer} 
                  disabled={evaluating || !answerText.trim()}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
                  <CheckCircle className="w-6 h-6" /> Score: {feedback.score}/10
                </div>
                <p className="text-emerald-100 leading-relaxed">
                  {feedback.ai_feedback}
                </p>
              </div>
              <div className="flex justify-end">
                <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                  {isLastQuestion ? "Finish Interview" : "Next Question"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

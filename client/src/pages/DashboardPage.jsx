import React, { useEffect, useState } from "react";
import {
  getSubjects,
  getAIRecommendations,
  getSchedules,
  createStudyLog,
  updateTopicStatus,
} from "../services/api";
import AIRecommendationCard from "../components/AIRecommendationCard";
import SubjectCard from "../components/SubjectCard";
import SessionLogModal from "../components/SessionLogModal";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  Plus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal control for quick log
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [selectedTopicTitle, setSelectedTopicTitle] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [subjectsRes, recsRes, schedulesRes] = await Promise.all([
        getSubjects().catch(() => []),
        getAIRecommendations(3).catch(() => ({ recommendations: [] })),
        getSchedules().catch(() => []),
      ]);

      setSubjects(Array.isArray(subjectsRes) ? subjectsRes : []);
      setRecommendations(recsRes?.recommendations || []);

      const todayStr = new Date().toISOString().split("T")[0];
      const todayList = (
        Array.isArray(schedulesRes) ? schedulesRes : []
      ).filter((s) => {
        if (!s.scheduled_date) return false;
        return (
          new Date(s.scheduled_date).toISOString().split("T")[0] === todayStr
        );
      });
      setTodaySchedules(todayList);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalSubjects = subjects.length;
  const totalTopics = subjects.reduce(
    (acc, s) => acc + (s.total_topics || 0),
    0,
  );
  const completedTopics = subjects.reduce(
    (acc, s) => acc + (s.completed_topics || 0),
    0,
  );

  const handleOpenLogModal = (topicId = "", topicTitle = "") => {
    setSelectedTopicId(topicId);
    setSelectedTopicTitle(topicTitle);
    setIsModalOpen(true);
  };

  const handleSaveLog = async (logData) => {
    await createStudyLog({
      topic_id: logData.topic_id,
      session_minutes: logData.session_minutes,
      notes: logData.notes,
    });

    if (logData.status) {
      await updateTopicStatus(logData.topic_id, logData.status);
    }

    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
        <p className="font-medium text-slate-700">
          Loading your Study Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-950 flex items-center gap-2">
            <span>🎓 Welcome to StudyPlanner</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track your progress, build customized study routines, and optimize
            topic mastery.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleOpenLogModal()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Log Study Session</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Subjects
            </p>
            <p className="text-2xl font-bold text-slate-900">{totalSubjects}</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Topics Completed
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {completedTopics} / {totalTopics}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overall Completion
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {totalTopics > 0
                ? Math.round((completedTopics / totalTopics) * 100)
                : 0}
              %
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Recommendations
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {recommendations.length} Topics
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Recommended Topics to Study Next
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Smart decay-curve prioritization
          </span>
        </div>

        {recommendations.length === 0 ? (
          <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
            No recommendations generated yet. Add subjects and topics to unlock
            smart AI recommendations!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <AIRecommendationCard
                key={rec.topic_id}
                recommendation={rec}
                onStartSession={(id, title) => handleOpenLogModal(id, title)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subjects Overview & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Subjects List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Subjects</h2>
            <button
              onClick={() => navigate("/subjects")}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              View All Subjects →
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
              You haven't created any subjects yet. Click "Subjects & Topics" to
              add your first subject!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.slice(0, 4).map((sub) => (
                <SubjectCard
                  key={sub.id}
                  subject={sub}
                  onSelect={() => navigate("/subjects")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Today's Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Today's Schedule
              </h2>
            </div>
            <button
              onClick={() => navigate("/schedules")}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Full Schedule →
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            {todaySchedules.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                No study sessions scheduled for today.
              </p>
            ) : (
              todaySchedules.map((sch) => (
                <div
                  key={sch.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-900">
                      {sch.topic?.title || `Topic #${sch.topic_id}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {sch.duration_minutes || 60} mins
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      sch.is_completed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {sch.is_completed ? "Done" : "Scheduled"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Log Session Modal */}
      <SessionLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTopicId={selectedTopicId}
        initialTopicTitle={selectedTopicTitle}
        topics={subjects.flatMap((s) => s.topics || [])}
        onSubmitLog={handleSaveLog}
      />
    </div>
  );
};

export default DashboardPage;

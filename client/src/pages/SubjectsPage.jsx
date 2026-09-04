import React, { useEffect, useState } from "react";
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  createTopic,
  updateTopic,
  deleteTopic,
  updateTopicStatus,
} from "../services/api";
import SubjectCard from "../components/SubjectCard";
import TopicTable from "../components/TopicTable";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  // Subject Modal states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");
  const [targetExamDate, setTargetExamDate] = useState("");

  // Topic Modal states
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [difficulty, setDifficulty] = useState("Medium");
  const [topicStatus, setTopicStatus] = useState("Not Started");

  const fetchSubjectsList = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSubjects();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectDetail = async (subjectId) => {
    try {
      setDetailLoading(true);
      const detail = await getSubject(subjectId);
      setSelectedSubjectDetail(detail);
    } catch (err) {
      console.error("Error fetching subject detail:", err);
      setError("Failed to load topic details for subject.");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectsList();
  }, []);

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    fetchSubjectDetail(subject.id);
  };

  // Subject Form handlers
  const handleOpenSubjectModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectTitle(subject.title || "");
      setSubjectDesc(subject.description || "");
      setTargetExamDate(
        subject.target_exam_date
          ? new Date(subject.target_exam_date).toISOString().split("T")[0]
          : "",
      );
    } else {
      setEditingSubject(null);
      setSubjectTitle("");
      setSubjectDesc("");
      setTargetExamDate("");
    }
    setShowSubjectModal(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: subjectTitle,
        description: subjectDesc || null,
        target_exam_date: targetExamDate ? `${targetExamDate}T00:00:00Z` : null,
      };

      if (editingSubject) {
        await updateSubject(editingSubject.id, payload);
      } else {
        await createSubject(payload);
      }

      setShowSubjectModal(false);
      fetchSubjectsList();
      if (selectedSubject && editingSubject?.id === selectedSubject.id) {
        fetchSubjectDetail(selectedSubject.id);
      }
    } catch (err) {
      console.error("Error saving subject:", err);
      setError("Failed to save subject.");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this subject and all its topics?",
      )
    )
      return;
    try {
      await deleteSubject(id);
      if (selectedSubject?.id === id) {
        setSelectedSubject(null);
        setSelectedSubjectDetail(null);
      }
      fetchSubjectsList();
    } catch (err) {
      console.error("Error deleting subject:", err);
      setError("Failed to delete subject.");
    }
  };

  // Topic Form handlers
  const handleOpenTopicModal = (topic = null) => {
    if (topic) {
      setEditingTopic(topic);
      setTopicTitle(topic.title || "");
      setEstimatedMinutes(topic.estimated_minutes || 60);
      setDifficulty(topic.difficulty || "Medium");
      setTopicStatus(topic.status || "Not Started");
    } else {
      setEditingTopic(null);
      setTopicTitle("");
      setEstimatedMinutes(60);
      setDifficulty("Medium");
      setTopicStatus("Not Started");
    }
    setShowTopicModal(true);
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    if (!selectedSubject) return;

    try {
      if (editingTopic) {
        await updateTopic(editingTopic.id, {
          title: topicTitle,
          estimated_minutes: Number(estimatedMinutes),
          difficulty,
          status: topicStatus,
        });
      } else {
        await createTopic({
          subject_id: selectedSubject.id,
          title: topicTitle,
          estimated_minutes: Number(estimatedMinutes),
          difficulty,
          status: topicStatus,
        });
      }

      setShowTopicModal(false);
      fetchSubjectDetail(selectedSubject.id);
      fetchSubjectsList();
    } catch (err) {
      console.error("Error saving topic:", err);
      setError("Failed to save topic.");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try {
      await deleteTopic(topicId);
      if (selectedSubject) {
        fetchSubjectDetail(selectedSubject.id);
        fetchSubjectsList();
      }
    } catch (err) {
      console.error("Error deleting topic:", err);
      setError("Failed to delete topic.");
    }
  };

  const handleTopicStatusChange = async (topicId, newStatus) => {
    try {
      await updateTopicStatus(topicId, newStatus);
      if (selectedSubject) {
        fetchSubjectDetail(selectedSubject.id);
        fetchSubjectsList();
      }
    } catch (err) {
      console.error("Error updating topic status:", err);
    }
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
        <p className="font-medium text-slate-700">
          Loading Subjects & Topics...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-950 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-indigo-600" />
            <span>Subject & Topic Management</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Organize study subjects, define nested topics, set difficulties, and
            track completion.
          </p>
        </div>
        <div>
          <button
            onClick={() => handleOpenSubjectModal()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Subject</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Detail View Mode if Subject Selected */}
      {selectedSubject ? (
        <div className="space-y-6">
          <button
            onClick={() => {
              setSelectedSubject(null);
              setSelectedSubjectDetail(null);
            }}
            className="flex items-center space-x-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Subjects</span>
          </button>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedSubject.title}
                </h2>
                {selectedSubject.description && (
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedSubject.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenSubjectModal(selectedSubject)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50"
                >
                  Edit Subject
                </button>
                <button
                  onClick={() => handleDeleteSubject(selectedSubject.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 font-medium text-xs rounded-lg hover:bg-red-100"
                >
                  Delete Subject
                </button>
              </div>
            </div>

            {/* Nested Topics Table */}
            {detailLoading ? (
              <div className="p-8 text-center text-slate-500">
                <RefreshCw className="h-6 w-6 animate-spin text-indigo-600 mx-auto mb-2" />
                <span>Loading topic details...</span>
              </div>
            ) : (
              <TopicTable
                topics={selectedSubjectDetail?.topics || []}
                onAddTopic={() => handleOpenTopicModal()}
                onEdit={(topic) => handleOpenTopicModal(topic)}
                onDelete={handleDeleteTopic}
                onStatusChange={handleTopicStatusChange}
              />
            )}
          </div>
        </div>
      ) : (
        /* Subjects Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.length === 0 ? (
            <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                No subjects created yet
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Start by adding your first subject, like "Data Structures" or
                "Linear Algebra".
              </p>
              <button
                onClick={() => handleOpenSubjectModal()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg"
              >
                + Add New Subject
              </button>
            </div>
          ) : (
            subjects.map((sub) => (
              <SubjectCard
                key={sub.id}
                subject={sub}
                onSelect={handleSelectSubject}
                onEdit={handleOpenSubjectModal}
                onDelete={handleDeleteSubject}
              />
            ))
          )}
        </div>
      )}

      {/* Create / Edit Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative">
            <button
              onClick={() => setShowSubjectModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              title="Close"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              {editingSubject ? "Edit Subject" : "Add New Subject"}
            </h3>
            <form onSubmit={handleSaveSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms"
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Course goals or description..."
                  value={subjectDesc}
                  onChange={(e) => setSubjectDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Exam Date
                </label>
                <input
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg"
                >
                  {editingSubject ? "Update Subject" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative">
            <button
              onClick={() => setShowTopicModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              title="Close"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              {editingTopic ? "Edit Topic" : "Add New Topic"}
            </h3>
            <form onSubmit={handleSaveTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Binary Search Trees"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Est. Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Status
                </label>
                <select
                  value={topicStatus}
                  onChange={(e) => setTopicStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg"
                >
                  {editingTopic ? "Update Topic" : "Create Topic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;

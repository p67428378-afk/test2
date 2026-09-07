import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TopNavbar from "../components/TopNavbar";
import SideNavBar from "../components/SideNavBar";
import { coursesAPI, assignmentsAPI, submissionsAPI } from "../services/api";
import {
  PlusCircle,
  BookOpen,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [pendingGrading, setPendingGrading] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourseForAssign, setSelectedCourseForAssign] = useState("");

  // Course Form
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [semester, setSemester] = useState("Fall 2026");

  // Assignment Form
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxPoints, setMaxPoints] = useState(100);

  // Grade Modal
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  const fetchFacultyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const courseList = await coursesAPI.listCourses();
      setCourses(Array.isArray(courseList) ? courseList : []);

      // Gather submissions needing grading from assignments
      let allSubmissions = [];
      for (const c of courseList) {
        try {
          const cAssigns = await coursesAPI.getCourseAssignments(c.id);
          for (const a of cAssigns) {
            const subs = await assignmentsAPI.getAssignmentSubmissions(a.id);
            if (Array.isArray(subs)) {
              allSubmissions = [
                ...allSubmissions,
                ...subs.map((s) => ({
                  ...s,
                  assignment_title: a.title,
                  course_code: c.course_code,
                })),
              ];
            }
          }
        } catch (e) {
          // ignore error per course
        }
      }
      setPendingGrading(
        allSubmissions.filter((s) => s.grade === null || s.grade === undefined),
      );
    } catch (err) {
      console.error("Faculty dashboard error:", err);
      setError("Unable to load faculty course metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await coursesAPI.createCourse({
        course_code: courseCode,
        title: courseTitle,
        description: courseDesc,
        semester,
      });
      setShowCourseModal(false);
      setCourseCode("");
      setCourseTitle("");
      setCourseDesc("");
      await fetchFacultyData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create course.");
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!selectedCourseForAssign) {
      alert("Please select a course for the assignment.");
      return;
    }
    try {
      await assignmentsAPI.createAssignment({
        course_id: selectedCourseForAssign,
        title: assignTitle,
        description: assignDesc,
        due_date: new Date(dueDate).toISOString(),
        max_points: Number(maxPoints),
      });
      setShowAssignModal(false);
      setAssignTitle("");
      setAssignDesc("");
      setDueDate("");
      await fetchFacultyData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create assignment.");
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    try {
      await submissionsAPI.gradeSubmission(gradingSubmission.id, {
        grade: Number(gradeInput),
        feedback: feedbackInput,
      });
      setGradingSubmission(null);
      setGradeInput("");
      setFeedbackInput("");
      await fetchFacultyData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to save grade.");
    }
  };

  const totalStudents = courses.reduce(
    (acc, c) => acc + (c.enrollment_count || 0),
    0,
  );

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <TopNavbar />

      <div className="flex gap-6">
        <SideNavBar
          onOpenCreateCourse={() => setShowCourseModal(true)}
          onOpenCreateAssignment={() => {
            if (courses.length > 0) setSelectedCourseForAssign(courses[0].id);
            setShowAssignModal(true);
          }}
        />

        <main className="flex-1 space-y-6">
          {/* Header Banner */}
          <div className="flex justify-between items-center bg-indigo-950 text-white p-6 rounded-2xl shadow">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">EduPro Faculty Portal</h1>
                <span className="bg-amber-500 text-indigo-950 font-bold px-2.5 py-0.5 rounded text-xs">
                  Instructor Dashboard
                </span>
              </div>
              <p className="text-indigo-200 text-xs mt-1">
                Manage active courses, post assignments, and grade student work.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCourseModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-indigo-950 font-bold px-4 py-2 rounded-xl text-sm shadow flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Course</span>
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow border border-slate-200">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Active Courses
              </p>
              <p className="text-3xl font-extrabold text-indigo-950 mt-1">
                {courses.length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow border border-slate-200">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Total Enrolled Students
              </p>
              <p className="text-3xl font-extrabold text-indigo-950 mt-1">
                {totalStudents}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow border border-slate-200">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Pending Grading
              </p>
              <p className="text-3xl font-extrabold text-amber-600 mt-1">
                {pendingGrading.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Managed Courses Table */}
            <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-950" />
                  <span>Managed Courses</span>
                </h3>
              </div>

              {loading ? (
                <p className="text-sm text-slate-400 py-6 text-center">
                  Loading course data...
                </p>
              ) : courses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Students</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {courses.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-bold text-indigo-950">
                            {c.course_code}
                          </td>
                          <td className="p-3 font-medium text-slate-800">
                            {c.title}
                          </td>
                          <td className="p-3 text-slate-600">
                            {c.enrollment_count || 0}
                          </td>
                          <td className="p-3 flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedCourseForAssign(c.id);
                                setShowAssignModal(true);
                              }}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 text-xs font-semibold transition"
                            >
                              + Assignment
                            </button>
                            <Link
                              to={`/courses/${c.id}`}
                              className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-xs font-semibold transition"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500 py-6 text-center">
                  No courses created yet. Click "Create Course" to get started.
                </p>
              )}
            </div>

            {/* Submissions Needing Grading Sidebar */}
            <aside className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-4 h-fit">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Pending Grading</span>
              </h3>

              {pendingGrading.length > 0 ? (
                <div className="space-y-3">
                  {pendingGrading.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 border border-slate-200 rounded-xl flex justify-between items-center bg-slate-50"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-800">
                          {sub.student?.full_name || "Student Submission"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {sub.course_code} • {sub.assignment_title}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setGradingSubmission(sub);
                          setGradeInput("");
                          setFeedbackInput("");
                        }}
                        className="px-3 py-1 bg-indigo-950 text-white rounded-lg text-xs font-bold hover:bg-indigo-900 transition"
                      >
                        Grade Now
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">
                  All student submissions are graded!
                </p>
              )}
            </aside>
          </div>
        </main>
      </div>

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowCourseModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">
              Create New Course
            </h3>
            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="CS101"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Introduction to Computer Science"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Semester
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-950 text-white font-bold rounded-lg text-sm hover:bg-indigo-900"
              >
                Create Course
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAssignModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">
              Create Assignment
            </h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Course
                </label>
                <select
                  value={selectedCourseForAssign}
                  onChange={(e) => setSelectedCourseForAssign(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.course_code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Lab 4: Data Structures"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Max Points
                </label>
                <input
                  type="number"
                  value={maxPoints}
                  onChange={(e) => setMaxPoints(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Instructions / Description
                </label>
                <textarea
                  rows={3}
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-950 text-white font-bold rounded-lg text-sm hover:bg-indigo-900"
              >
                Create Assignment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setGradingSubmission(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">
              Grade Student Submission
            </h3>
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <p>
                <span className="font-bold">Student:</span>{" "}
                {gradingSubmission.student?.full_name}
              </p>
              <p>
                <span className="font-bold">File:</span>{" "}
                {gradingSubmission.file_path}
              </p>
              <p>
                <span className="font-bold">Submitted:</span>{" "}
                {new Date(gradingSubmission.submitted_at).toUTCString()}
              </p>
            </div>
            <form onSubmit={handleGradeSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Grade Score (out of 100)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  placeholder="95"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Instructor Feedback
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Great work on data structures implementation!"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-700 text-white font-bold rounded-lg text-sm hover:bg-emerald-800"
              >
                Submit Grade & Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;

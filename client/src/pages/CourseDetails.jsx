import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import SideNavBar from "../components/SideNavBar";
import ModuleAccordion from "../components/ModuleAccordion";
import { coursesAPI, enrollmentsAPI } from "../services/api";
import {
  BookOpen,
  User,
  CheckCircle2,
  FileText,
  Bell,
  Users,
  Clock,
  AlertCircle,
} from "lucide-react";

const CourseDetails = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [roster, setRoster] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("modules");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cData, myEnrolls, cAssigns] = await Promise.all([
        coursesAPI.getCourse(courseId),
        enrollmentsAPI.getMyEnrollments().catch(() => []),
        coursesAPI.getCourseAssignments(courseId).catch(() => []),
      ]);

      setCourse(cData);
      setAssignments(Array.isArray(cAssigns) ? cAssigns : []);

      const enrolled = myEnrolls.some((e) => e.course_id === courseId);
      setIsEnrolled(enrolled);

      // Attempt to load roster
      coursesAPI
        .getCourseRoster(courseId)
        .then((rData) => setRoster(Array.isArray(rData) ? rData : []))
        .catch(() => setRoster([]));
    } catch (err) {
      console.error("Error fetching course details:", err);
      setError("Course not found or failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      await coursesAPI.enrollInCourse(courseId);
      setIsEnrolled(true);
      fetchCourseData();
    } catch (err) {
      alert(err.response?.data?.detail || "Enrollment failed.");
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen p-6">
        <TopNavbar />
        <div className="p-12 text-center text-slate-500 font-medium">
          Loading course information...
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-slate-50 min-h-screen p-6">
        <TopNavbar />
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow border text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">
            {error || "Course Not Found"}
          </h2>
          <Link
            to="/dashboard"
            className="inline-block px-4 py-2 bg-indigo-950 text-white font-bold rounded-lg text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <TopNavbar />

      <div className="flex gap-6">
        <SideNavBar />

        <main className="flex-1 space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow border border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-950 text-amber-400 p-4 rounded-xl font-extrabold text-2xl shadow">
                {course.course_code}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {course.title}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>
                    Instructor:{" "}
                    {course.instructor?.full_name || "Dr. Robert Smith"}
                  </span>
                  <span>•</span>
                  <span>{course.semester || "Fall 2026"}</span>
                </p>
              </div>
            </div>

            {isEnrolled ? (
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 font-bold text-sm rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Enrolled
              </span>
            ) : (
              <button
                onClick={handleEnroll}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-indigo-950 font-extrabold rounded-xl shadow text-sm transition"
              >
                Enroll in Course
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 border-b border-slate-200 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("modules")}
              className={`pb-3 transition border-b-2 ${
                activeTab === "modules"
                  ? "border-indigo-950 text-indigo-950 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Modules & Materials
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`pb-3 transition border-b-2 ${
                activeTab === "assignments"
                  ? "border-indigo-950 text-indigo-950 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Assignments ({assignments.length})
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`pb-3 transition border-b-2 ${
                activeTab === "announcements"
                  ? "border-indigo-950 text-indigo-950 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`pb-3 transition border-b-2 ${
                activeTab === "roster"
                  ? "border-indigo-950 text-indigo-950 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Course Roster
            </button>
          </div>

          {/* Tab Contents */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {activeTab === "modules" && (
                <section className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-lg">
                    Course Syllabus & Modules
                  </h3>
                  <ModuleAccordion modules={course.modules} />
                </section>
              )}

              {activeTab === "assignments" && (
                <section className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-lg">
                    Course Assignments
                  </h3>
                  {assignments.length > 0 ? (
                    <div className="space-y-3">
                      {assignments.map((a) => (
                        <div
                          key={a.id}
                          className="bg-white p-4 rounded-xl shadow border border-slate-200 flex justify-between items-center hover:shadow-md transition"
                        >
                          <div>
                            <Link
                              to={`/assignments/${a.id}`}
                              className="font-bold text-slate-900 text-base hover:text-indigo-900"
                            >
                              {a.title}
                            </Link>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                Due: {new Date(a.due_date).toUTCString()}
                              </span>
                              <span>•</span>
                              <span>Max Points: {a.max_points}</span>
                            </p>
                          </div>
                          <Link
                            to={`/assignments/${a.id}`}
                            className="px-3 py-1.5 bg-indigo-950 text-white rounded-lg text-xs font-bold hover:bg-indigo-900 transition"
                          >
                            View & Submit
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic bg-white p-6 rounded-xl border">
                      No assignments published for this course yet.
                    </p>
                  )}
                </section>
              )}

              {activeTab === "announcements" && (
                <section className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-lg">
                    Course Announcements
                  </h3>
                  <div className="bg-white p-6 rounded-xl shadow border border-slate-200 space-y-4">
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-indigo-950 text-sm">
                          Welcome to {course.course_code}!
                        </span>
                        <span className="text-xs text-slate-400">
                          Oct 1, 2026 14:00 UTC
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Please review the course syllabus in Module 1. Lecture
                        slides and lab code examples will be updated weekly.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "roster" && (
                <section className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-lg">
                    Class Roster
                  </h3>
                  <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                    {roster.length > 0 ? (
                      <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                          <tr>
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Enrolled At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {roster.map((r) => (
                            <tr key={r.id}>
                              <td className="p-3 font-semibold text-slate-800">
                                {r.student?.full_name || "Enrolled Student"}
                              </td>
                              <td className="p-3 text-slate-600">
                                {r.student?.email || "N/A"}
                              </td>
                              <td className="p-3 text-slate-500 text-xs">
                                {new Date(r.enrolled_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-xs text-slate-500 italic py-4 text-center">
                        No enrolled students listed.
                      </p>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Announcements feed */}
            <aside className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-4 h-fit">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <Bell className="w-5 h-5 text-indigo-950" />
                <span>Recent Updates</span>
              </h3>
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
                <p className="font-bold text-indigo-950">
                  Welcome to {course.course_code}!
                </p>
                <p className="text-slate-600">
                  Review syllabus and download starter code.
                </p>
                <p className="text-slate-400 text-[10px]">Fall 2026</p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetails;

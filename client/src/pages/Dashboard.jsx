import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TopNavbar from "../components/TopNavbar";
import SideNavBar from "../components/SideNavBar";
import CourseCard from "../components/CourseCard";
import { coursesAPI, enrollmentsAPI, assignmentsAPI } from "../services/api";
import {
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [enrollData, coursesData, assignData] = await Promise.all([
        enrollmentsAPI.getMyEnrollments().catch(() => []),
        coursesAPI.listCourses().catch(() => []),
        assignmentsAPI.listAssignments().catch(() => []),
      ]);
      setEnrollments(Array.isArray(enrollData) ? enrollData : []);
      setAllCourses(Array.isArray(coursesData) ? coursesData : []);
      setAssignments(Array.isArray(assignData) ? assignData : []);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Unable to fetch complete dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await coursesAPI.enrollInCourse(courseId);
      await fetchData();
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(
        err.response?.data?.detail || "Enrollment failed or deadline passed.",
      );
    }
  };

  const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id));
  const enrolledCourses = enrollments.map((e) => e.course).filter(Boolean);
  const availableCourses = allCourses.filter(
    (c) => !enrolledCourseIds.has(c.id),
  );

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <TopNavbar />

      <div className="flex gap-6">
        <SideNavBar />

        <main className="flex-1 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-indigo-950 text-white p-6 rounded-2xl shadow flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.full_name || "Alex"}!
              </h1>
              <p className="text-indigo-200 mt-1 text-sm">
                Fall 2026 Semester • Student Dashboard
              </p>
            </div>
            <button
              onClick={fetchData}
              title="Refresh Dashboard"
              className="p-2 bg-indigo-900 hover:bg-indigo-800 rounded-lg text-xs flex items-center gap-1 transition"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Main Content Area: Enrolled Courses & Available Catalog */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Enrolled Courses Section */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-950" />
                    <span>Enrolled Courses</span>
                  </h2>
                  <span className="text-xs font-semibold bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-full">
                    {enrolledCourses.length} Enrolled
                  </span>
                </div>

                {loading ? (
                  <div className="p-8 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
                    Loading your enrolled courses...
                  </div>
                ) : enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrolledCourses.map((course, idx) => (
                      <CourseCard
                        key={course.id || idx}
                        course={course}
                        isEnrolled={true}
                        progress={Math.min(65 + idx * 15, 95)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                    You are not currently enrolled in any courses. Browse
                    available courses below to enroll!
                  </div>
                )}
              </section>

              {/* Available Courses Catalog */}
              <section className="space-y-4 pt-4 border-t border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">
                  Course Catalog & Enrollment
                </h2>
                {availableCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        isEnrolled={false}
                        onEnroll={handleEnroll}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-500 text-xs text-center">
                    All available courses have been enrolled.
                  </div>
                )}
              </section>
            </div>

            {/* Right Sidebar: Upcoming Assignments */}
            <aside className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-4 h-fit">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span>Upcoming Assignments</span>
              </h3>

              {assignments.length > 0 ? (
                <ul className="space-y-3">
                  {assignments.slice(0, 5).map((assign) => (
                    <li
                      key={assign.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center hover:bg-slate-100 transition"
                    >
                      <div>
                        <Link
                          to={`/assignments/${assign.id}`}
                          className="font-semibold text-sm text-slate-800 hover:text-indigo-900"
                        >
                          {assign.title}
                        </Link>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> Due:{" "}
                          {new Date(assign.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        to={`/assignments/${assign.id}`}
                        className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded text-xs font-semibold hover:bg-amber-200 transition"
                      >
                        Submit
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 italic">
                  No pending assignments found.
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

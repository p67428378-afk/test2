import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import SideNavBar from "../components/SideNavBar";
import FileUploadBox from "../components/FileUploadBox";
import SubmissionReceipt from "../components/SubmissionReceipt";
import { assignmentsAPI, submissionsAPI } from "../services/api";
import {
  Clock,
  Award,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const AssignmentDetails = () => {
  const { id: assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssignmentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const aData = await assignmentsAPI.getAssignment(assignmentId);
      setAssignment(aData);

      // Fetch user's existing submission if available
      try {
        const mySubs = await submissionsAPI.getMySubmissions();
        if (Array.isArray(mySubs)) {
          const match = mySubs.find((s) => s.assignment_id === assignmentId);
          if (match) setSubmission(match);
        }
      } catch (e) {
        // ignore error fetching my submissions
      }
    } catch (err) {
      console.error("Error loading assignment:", err);
      setError("Assignment not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentData();
  }, [assignmentId]);

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file to submit.");
      return;
    }
    setSubmitting(true);
    try {
      const receiptData = await assignmentsAPI.submitAssignment(assignmentId, {
        file_path: selectedFile.name,
      });
      setReceipt(receiptData);
      setSelectedFile(null);
      await fetchAssignmentData();
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.response?.data?.detail || "Failed to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen p-6">
        <TopNavbar />
        <div className="p-12 text-center text-slate-500 font-medium">
          Loading assignment details...
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="bg-slate-50 min-h-screen p-6">
        <TopNavbar />
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">
            {error || "Assignment Not Found"}
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
          <Link
            to={`/courses/${assignment.course_id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Course
          </Link>

          {/* Assignment Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow border border-slate-200">
            <div className="flex justify-between items-start">
              <span className="text-xs font-extrabold uppercase text-indigo-950 bg-indigo-100 px-3 py-1 rounded-md">
                Assignment
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
                Max Points: {assignment.max_points || 100}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-3">
              {assignment.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                Due Date: {new Date(assignment.due_date).toUTCString()}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Instructions Main Column */}
            <main className="col-span-12 lg:col-span-7 bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3">
                Assignment Instructions
              </h3>
              <div className="text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-wrap">
                {assignment.description ||
                  "Implement assigned problem set, include tests, and upload submission file."}
              </div>
            </main>

            {/* Submissions & Receipts Column */}
            <aside className="col-span-12 lg:col-span-5 space-y-6">
              {/* Upload Box */}
              <div className="bg-white p-6 rounded-2xl shadow border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3">
                  Upload Submission
                </h3>
                <FileUploadBox
                  selectedFile={selectedFile}
                  onFileSelected={(file) => setSelectedFile(file)}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || submitting}
                  className="w-full py-2.5 bg-indigo-950 text-white font-bold rounded-xl shadow hover:bg-indigo-900 transition text-sm disabled:opacity-50"
                >
                  {submitting ? "Uploading Submission..." : "Submit Assignment"}
                </button>
              </div>

              {/* Receipt or Submission Display */}
              {(receipt || submission) && (
                <SubmissionReceipt receipt={receipt} submission={submission} />
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignmentDetails;

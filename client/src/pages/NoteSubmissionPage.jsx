import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MarkdownEditor } from "../components/editor/MarkdownEditor.jsx";
import { CitationsBuilder } from "../components/editor/CitationsBuilder.jsx";
import { noteService, tagService } from "../services/api.js";
import {
  Send,
  ArrowLeft,
  Tag as TagIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function NoteSubmissionPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(["Redis", "Performance"]);
  const [availableTags, setAvailableTags] = useState([]);
  const [citations, setCitations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const data = await tagService.getTags();
      if (Array.isArray(data)) {
        setAvailableTags(data);
      }
    } catch (e) {
      // Non-blocking
    }
  };

  const handleAddTag = (tagName) => {
    const clean = tagName.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagName) => {
    setTags(tags.filter((t) => t !== tagName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!title.trim() || !body.trim()) {
      setError("Title and note body content are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        category,
        tags,
        citations,
      };

      const result = await noteService.createNote(payload);
      setSuccessMsg(
        "Research note submitted successfully! It is now queued for SME expert review.",
      );

      setTimeout(() => {
        if (result?.id) {
          navigate(`/notes/${result.id}`);
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to submit research note. Please check form inputs.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Knowledge Base</span>
        </Link>
        <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-semibold">
          Status: Enters Pending Review Queue
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <FileText className="h-6 w-6 text-emerald-600" />
            <span>Submit Technical Research Note</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Document findings, benchmark data, and technical research notes.
            Submitted notes will be reviewed by Subject Matter Experts before
            publishing to the internal knowledge base.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Note Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Cache Benchmarks & Redis Clustering Insights"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category Taxonomy
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="General">General</option>
                <option value="Architecture">Architecture</option>
                <option value="Performance">Performance</option>
                <option value="Security">Security</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Research Body Content (Markdown Supported) *
            </label>
            <MarkdownEditor value={body} onChange={setBody} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Taxonomy Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200"
                >
                  <TagIcon className="h-3 w-3" />
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="ml-1 text-emerald-600 hover:text-emerald-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                placeholder="Add tag and press Enter..."
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700"
              >
                Add Tag
              </button>
            </div>
          </div>

          <CitationsBuilder citations={citations} onChange={setCitations} />

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Link
              to="/"
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-md flex items-center space-x-2 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>
                {isSubmitting ? "Submitting..." : "Submit for SME Review"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteSubmissionPage;

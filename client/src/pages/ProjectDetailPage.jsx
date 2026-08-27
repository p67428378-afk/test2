import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectById } from "../services/api.js";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Building,
  Calendar,
  Layers,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectById(id);
        if (isMounted) {
          setProject(data);
          if (data.thumbnail_url) {
            setSelectedImage(data.thumbnail_url);
          } else if (data.gallery_images && data.gallery_images.length > 0) {
            setSelectedImage(data.gallery_images[0]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.detail ||
              err.message ||
              "Failed to load project details.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchDetail();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Loading project information...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-800 mb-1">
            Project Not Found
          </h2>
          <p className="text-sm text-red-600 mb-6">
            {error || "The requested project could not be found."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio Gallery</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    summary,
    full_description,
    gallery_images = [],
    tags = [],
    live_demo_url,
    github_url,
    client_context,
    created_at,
  } = project;

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-3">
          {live_demo_url && (
            <a
              href={live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          )}
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Repository</span>
            </a>
          )}
        </div>
      </div>

      {/* Hero Title & Summary */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171C29] tracking-tight">
            {title}
          </h1>
          <p className="text-base text-[#707A8C] mt-2 max-w-3xl leading-relaxed">
            {summary}
          </p>

          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-4">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published on {formattedDate}</span>
            </div>
          )}
        </div>

        {/* Media Preview Section */}
        {selectedImage ? (
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img
                src={selectedImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {gallery_images && gallery_images.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {project.thumbnail_url && (
                  <button
                    type="button"
                    onClick={() => setSelectedImage(project.thumbnail_url)}
                    className={`aspect-video w-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === project.thumbnail_url
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={project.thumbnail_url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                )}
                {gallery_images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-video w-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Gallery screenshot ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video w-full rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <Layers className="w-12 h-12 mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">
              No gallery images uploaded for this project.
            </p>
          </div>
        )}

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-slate-100">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#171C29] mb-3">
                Project Scope &amp; Architecture
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
                {full_description || summary}
              </div>
            </div>

            {client_context && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Client Background &amp; Delivery Value</span>
                </div>
                <p className="text-sm text-blue-800/90 leading-relaxed">
                  {client_context}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-[#F7FAFC] border border-[#E3E8F0] rounded-xl p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171C29]">
                Technology Specifications
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white border border-[#E3E8F0] text-slate-700 rounded-md text-xs font-medium shadow-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 text-center space-y-4">
              <MessageSquare className="w-8 h-8 text-blue-600 mx-auto" />
              <div>
                <h4 className="font-bold text-blue-950 text-sm">
                  Interested in building a similar platform?
                </h4>
                <p className="text-xs text-blue-800/80 mt-1">
                  I can design, develop, and deliver high-performance
                  applications tailored to your business.
                </p>
              </div>
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <span>Inquire About Your Project</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

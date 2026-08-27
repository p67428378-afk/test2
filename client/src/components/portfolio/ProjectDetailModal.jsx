import React from "react";
import Modal from "react-modal";
import {
  X,
  ExternalLink,
  Github,
  Building,
  Tag,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

export default function ProjectDetailModal({ project, isOpen, onClose }) {
  if (!project) return null;

  const {
    title,
    summary,
    full_description,
    thumbnail_url,
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
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`Project Details - ${title}`}
      className="max-w-3xl w-full mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 outline-none overflow-hidden max-h-[90vh] flex flex-col"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-[#171C29]">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto space-y-6 flex-1">
        {thumbnail_url && (
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={thumbnail_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Overview
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {full_description || summary}
          </p>
        </div>

        {client_context && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm mb-1">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Client Context &amp; Business Impact</span>
            </div>
            <p className="text-blue-800/80 text-sm">{client_context}</p>
          </div>
        )}

        {tags && tags.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Tech Stack &amp; Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {gallery_images && gallery_images.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Gallery &amp; Screenshots
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery_images.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  className="aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                >
                  <img
                    src={img}
                    alt={`${title} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {formattedDate && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Completed on {formattedDate}</span>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {live_demo_url && (
            <a
              href={live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Demo</span>
            </a>
          )}
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>View Repository</span>
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

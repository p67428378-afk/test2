import React, { useState } from "react";
import { ExternalLink, Github, Eye, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project, onSelectProject }) {
  const [imgError, setImgError] = useState(false);

  if (!project) return null;

  const {
    id,
    title,
    summary,
    thumbnail_url,
    tags = [],
    live_demo_url,
    github_url,
  } = project;

  const showPlaceholder = !thumbnail_url || imgError;

  return (
    <div
      data-testid={`project-card-${id}`}
      className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group"
    >
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-[#E3E8F0]">
        {showPlaceholder ? (
          <div
            data-testid="project-thumbnail-placeholder"
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 text-center"
          >
            <Layers className="w-10 h-10 mb-2 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Project Preview
            </span>
          </div>
        ) : (
          <img
            src={thumbnail_url}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#171C29] mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-[#707A8C] mb-4 line-clamp-3">{summary}</p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {live_demo_url && (
              <a
                href={live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                title="Live Demo"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Demo</span>
              </a>
            )}
            {github_url && (
              <a
                href={github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
                title="Source Code"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onSelectProject ? (
              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </button>
            ) : null}
            <Link
              to={`/projects/${id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-md transition-colors"
            >
              <span>Details &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

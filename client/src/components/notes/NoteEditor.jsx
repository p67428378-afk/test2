import React, { useState, useEffect } from "react";
import AttachmentList from "./AttachmentList";
import UploadZone from "./UploadZone";

export default function NoteEditor({
  note,
  onSave,
  onCancel,
  onUploadAttachment,
  onDeleteAttachment,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setTags(note.tags || []);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
    }
  }, [note]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      const tag = newTag.trim().toLowerCase();
      if (!tags.includes(tag)) {
        setTags([...tags, tag]);
      }
      setNewTag("");
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      title,
      content,
      tags,
    });
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-outline">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] mb-2">
            edit_note
          </span>
          <p className="font-body-lg">
            Select a note or create a new one to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      {/* Editor Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12 lg:px-24">
        <div className="max-w-[800px] mx-auto pb-32">
          {/* Title Area */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none p-0 font-headline-lg text-headline-lg text-on-surface focus:ring-0 placeholder:text-outline-variant mb-4 outline-none"
            placeholder="Note Title"
          />

          {/* Tags Area */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-outline-variant/20 pb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container/10 text-secondary-container font-label-md text-label-md border border-secondary-container/20 group"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-secondary-container/70 hover:text-secondary-container"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    close
                  </span>
                </button>
              </span>
            ))}

            {showTagInput ? (
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                onBlur={() => setShowTagInput(false)}
                autoFocus
                className="bg-surface-variant/40 border border-outline-variant/50 rounded-full px-3 py-1 text-label-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Press Enter..."
              />
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-variant/30 text-on-surface-variant font-label-md text-label-md border border-dashed border-outline-variant hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  add
                </span>{" "}
                Add Tag
              </button>
            )}
          </div>

          {/* Formatting Toolbar (Visual only) */}
          <div className="flex items-center gap-1 p-1 bg-surface-container border border-outline-variant/40 rounded-xl mb-6 shadow-lg inline-flex sticky top-2 z-10 backdrop-blur-md bg-opacity-80">
            <button className="p-1.5 rounded-lg text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                format_bold
              </span>
            </button>
            <button className="p-1.5 rounded-lg text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                format_italic
              </span>
            </button>
            <button className="p-1.5 rounded-lg text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                format_underlined
              </span>
            </button>
            <div className="w-px h-5 bg-outline-variant/50 mx-1"></div>
            <button className="p-1.5 rounded-lg text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                code
              </span>
            </button>
            <button className="p-1.5 rounded-lg text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                format_list_bulleted
              </span>
            </button>
          </div>

          {/* Content Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border-none p-0 font-body-lg text-body-lg text-on-surface-variant leading-relaxed outline-none focus:ring-0 resize-none min-h-[300px]"
            placeholder="Start writing your note here..."
          />

          {/* Attachments Section */}
          <AttachmentList
            attachments={note.attachments}
            onDeleteAttachment={onDeleteAttachment}
          />

          {/* Upload Zone */}
          <div className="mt-6">
            <UploadZone onUpload={onUploadAttachment} />
          </div>
        </div>
      </div>

      {/* Sticky Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent border-t border-transparent pointer-events-none">
        <div className="max-w-[800px] mx-auto flex justify-end gap-3 pointer-events-auto">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant/50 transition-colors border border-outline-variant/30"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-fixed transition-colors shadow-[0_4px_14px_rgba(192,193,255,0.2)]"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

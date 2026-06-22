import React, { useState, useEffect } from "react";
import NotesList from "../components/notes/NotesList";
import NoteEditor from "../components/notes/NoteEditor";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  uploadAttachment,
  deleteAttachment,
} from "../services/api";

export default function WorkspacePage({
  activeTag,
  onTagSelect,
  newNoteTrigger,
  onRefreshStats,
}) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [isSaving, setIsSaving] = useState(false);

  const fetchNotesList = async () => {
    try {
      const params = {
        q: searchQuery || undefined,
        tag: activeTag || undefined,
      };
      const data = await getNotes(params);

      // Sort notes locally
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return sortBy === "date_desc" ? dateB - dateA : dateA - dateB;
      });

      setNotes(sorted);

      // If there's a selected note ID, refresh its details
      if (selectedNoteId) {
        const details = await getNote(selectedNoteId);
        setSelectedNote(details);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotesList();
  }, [searchQuery, activeTag, sortBy, selectedNoteId]);

  const handleNoteSelect = async (id) => {
    try {
      setSelectedNoteId(id);
      const details = await getNote(id);
      setSelectedNote(details);
    } catch (error) {
      console.error("Error fetching note details:", error);
    }
  };

  const handleNewNote = async () => {
    try {
      const newNoteData = {
        title: "Untitled Note",
        content: "",
        tags: activeTag ? [activeTag] : [],
      };
      const created = await createNote(newNoteData);
      setSelectedNoteId(created.id);
      setSelectedNote(created);
      fetchNotesList();
      if (onRefreshStats) onRefreshStats();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Listen to newNoteTrigger from parent
  useEffect(() => {
    if (newNoteTrigger > 0) {
      handleNewNote();
    }
  }, [newNoteTrigger]);

  const handleSaveNote = async (updatedData) => {
    if (!selectedNoteId) return;
    try {
      setIsSaving(true);
      const updated = await updateNote(selectedNoteId, updatedData);
      setSelectedNote(updated);
      fetchNotesList();
      if (onRefreshStats) onRefreshStats();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNoteId) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(selectedNoteId);
        setSelectedNote(null);
        setSelectedNoteId(null);
        fetchNotesList();
        if (onRefreshStats) onRefreshStats();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleUploadAttachment = async (file) => {
    if (!selectedNoteId) return;
    try {
      await uploadAttachment(selectedNoteId, file);
      // Refresh note details to show new attachment
      const details = await getNote(selectedNoteId);
      setSelectedNote(details);
      fetchNotesList();
      if (onRefreshStats) onRefreshStats();
    } catch (error) {
      console.error("Error uploading attachment:", error);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await deleteAttachment(attachmentId);
      // Refresh note details
      const details = await getNote(selectedNoteId);
      setSelectedNote(details);
      fetchNotesList();
      if (onRefreshStats) onRefreshStats();
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <NotesList
        notes={notes}
        selectedNoteId={selectedNoteId}
        onNoteSelect={handleNoteSelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <NoteEditor
        note={selectedNote}
        onSave={handleSaveNote}
        onCancel={() => setSelectedNote(null)}
        onUploadAttachment={handleUploadAttachment}
        onDeleteAttachment={handleDeleteAttachment}
      />
    </div>
  );
}

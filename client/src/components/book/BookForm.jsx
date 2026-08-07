import React, { useState, useEffect } from "react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";

export default function BookForm({
  initialData,
  onSubmit,
  onCancel,
  error: apiError,
}) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publication_date: "",
    total_copies: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        author: initialData.author || "",
        isbn: initialData.isbn || "",
        genre: initialData.genre || "",
        publication_date: initialData.publication_date || "",
        total_copies: initialData.total_copies || 1,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "total_copies" ? parseInt(value, 10) || 1 : value,
    }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.publication_date)
      newErrors.publication_date = "Publication Date is required";
    if (formData.total_copies < 1)
      newErrors.total_copies = "Total copies must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-2xl mx-auto"
    >
      <h3 className="text-lg font-semibold text-slate-100">
        {initialData ? "Edit Book" : "Add New Book"}
      </h3>

      {apiError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          {apiError}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Title *"
          id="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g. The Great Gatsby"
          required
        />

        <Input
          label="Author *"
          id="author"
          value={formData.author}
          onChange={handleChange}
          error={errors.author}
          placeholder="e.g. F. Scott Fitzgerald"
          required
        />

        <Input
          label="ISBN *"
          id="isbn"
          value={formData.isbn}
          onChange={handleChange}
          error={errors.isbn}
          placeholder="e.g. 9780743273565"
          required
        />

        <Input
          label="Genre"
          id="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="e.g. Fiction"
        />

        <Input
          label="Publication Date *"
          id="publication_date"
          type="date"
          value={formData.publication_date}
          onChange={handleChange}
          error={errors.publication_date}
          required
        />

        <Input
          label="Total Copies *"
          id="total_copies"
          type="number"
          min="1"
          value={formData.total_copies}
          onChange={handleChange}
          error={errors.total_copies}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Save Changes" : "Add Book"}
        </Button>
      </div>
    </form>
  );
}

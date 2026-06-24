import React, { useState } from "react";
import Button from "../common/Button.jsx";
import WarningBanner from "../common/WarningBanner.jsx";

const BookForm = ({ onSubmit, isLoading = false, externalError = "" }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [errors, setErrors] = useState({});
  const [warning, setWarning] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!isbn.trim()) {
      newErrors.isbn = "ISBN is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning("");
    if (!validate()) return;

    try {
      await onSubmit({
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        publication_date: publicationDate || null,
      });
      // Reset form on success
      setTitle("");
      setAuthor("");
      setIsbn("");
      setPublicationDate("");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setWarning("ISBN already exists in the catalog");
      } else {
        setWarning(err.message || "An error occurred while saving the book");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-md bg-surface-container-lowest p-lg rounded-lg border border-outline-variant shadow-sm max-w-xl mx-auto"
    >
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">
        Add New Book
      </h2>

      {(warning || externalError) && (
        <WarningBanner
          message={warning || externalError}
          onClose={() => {
            setWarning("");
          }}
        />
      )}

      <div className="space-y-1">
        <label
          htmlFor="title"
          className="block font-body-md text-body-md font-medium text-on-surface"
        >
          Title <span className="text-error">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all ${
            errors.title ? "border-error" : "border-outline-variant"
          }`}
          placeholder="e.g. The Great Gatsby"
        />
        {errors.title && (
          <p className="text-error text-xs mt-1" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="author"
          className="block font-body-md text-body-md font-medium text-on-surface"
        >
          Author
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
          placeholder="e.g. F. Scott Fitzgerald"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="isbn"
          className="block font-body-md text-body-md font-medium text-on-surface"
        >
          ISBN <span className="text-error">*</span>
        </label>
        <input
          id="isbn"
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className={`w-full px-4 py-2 bg-surface-container-lowest border rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all ${
            errors.isbn ? "border-error" : "border-outline-variant"
          }`}
          placeholder="e.g. 9780743273565"
        />
        {errors.isbn && (
          <p className="text-error text-xs mt-1" role="alert">
            {errors.isbn}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="publicationDate"
          className="block font-body-md text-body-md font-medium text-on-surface"
        >
          Publication Date
        </label>
        <input
          id="publicationDate"
          type="date"
          value={publicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
          className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
        />
      </div>

      <div className="pt-4 flex justify-end gap-sm">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Book"}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;

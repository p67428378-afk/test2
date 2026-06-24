import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "../services/api.js";
import BookForm from "../components/books/BookForm.jsx";

const AddBookPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddBook = async (bookData) => {
    setIsLoading(true);
    setSuccessMessage("");
    try {
      await createBook(bookData);
      setSuccessMessage("Book successfully added to the catalog!");
      setTimeout(() => {
        navigate("/catalog");
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      throw err; // Let the form handle the error (e.g. ISBN already exists)
    }
  };

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Add Book
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Add a new book to the library catalog.
        </p>
      </div>

      {successMessage && (
        <div
          className="bg-primary-container/10 border border-primary-container/20 text-primary-container p-md rounded-lg flex items-center gap-2 max-w-xl mx-auto"
          role="alert"
        >
          <span className="material-symbols-outlined">check_circle</span>
          <span className="font-body-md text-body-md font-medium">
            {successMessage}
          </span>
        </div>
      )}

      <BookForm onSubmit={handleAddBook} isLoading={isLoading} />
    </div>
  );
};

export default AddBookPage;

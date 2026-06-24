import React from "react";
import Badge from "../common/Badge.jsx";

const BookTable = ({ books = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-lg text-center font-body-md text-body-md text-on-surface-variant">
        Loading books...
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="p-lg text-center font-body-md text-body-md text-on-surface-variant">
        No books found in the catalog.
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">
                Title
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">
                Author
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">
                ISBN
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">
                Publication Date
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
            {books.map((book) => (
              <tr
                key={book.id}
                className="hover:bg-surface-container-lowest transition-colors group"
              >
                <td className="py-3 px-4 font-semibold text-on-surface">
                  {book.title}
                </td>
                <td className="py-3 px-4 text-on-surface-variant">
                  {book.author || "-"}
                </td>
                <td className="py-3 px-4 text-on-surface-variant font-code-sm text-code-sm">
                  {book.isbn}
                </td>
                <td className="py-3 px-4 text-on-surface-variant">
                  {book.publication_date || "-"}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      book.status === "Available" ? "success" : "warning"
                    }
                  >
                    {book.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTable;

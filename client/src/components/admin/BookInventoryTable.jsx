import React from "react";

export default function BookInventoryTable({ books }) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-lg">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
          menu_book
        </span>
        <h3 className="text-lg font-semibold text-on-surface mb-1">
          No books in inventory
        </h3>
        <p className="text-on-surface-variant">
          Add some books to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-outline-variant">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                ISBN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Published Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Total Copies
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Available Copies
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-outline-variant">
            {books.map((book) => {
              const isAvailable = book.available_copies > 0;

              return (
                <tr
                  key={book.id}
                  className="hover:bg-surface-container-low/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                    {book.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {book.isbn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {book.published_date
                      ? new Date(book.published_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {book.total_copies}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {book.available_copies}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {isAvailable ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary-container/10 text-tertiary-container">
                        Available
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-error/10 text-error">
                        Out of Stock
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

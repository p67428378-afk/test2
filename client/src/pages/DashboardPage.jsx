import React, { useEffect, useState } from "react";
import { getBooks } from "../services/api.js";
import BookTable from "../components/books/BookTable.jsx";

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        const data = await getBooks("", 0, 5);
        setBooks(data);
      } catch (err) {
        // Silent catch or handle gracefully
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentBooks();
  }, []);

  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.status === "Available").length;
  const borrowedBooks = books.filter((b) => b.status === "Borrowed").length;
  const overdueBooks = books.filter((b) => b.status === "Overdue").length;

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Dashboard Overview
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Welcome back, Aarchi. Here's what's happening today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-md shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Total Books
            </span>
            <span className="material-symbols-outlined text-primary-container">
              library_books
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {totalBooks}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-md shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Available
            </span>
            <span className="material-symbols-outlined text-on-surface-variant">
              check_circle
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {availableBooks}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-md shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Borrowed
            </span>
            <span className="material-symbols-outlined text-on-surface-variant">
              book
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {borrowedBooks}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-md shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Overdue
            </span>
            <span className="material-symbols-outlined text-error">
              warning
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-headline-lg text-headline-lg text-error">
              {overdueBooks}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-lg border border-outline-variant p-md shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Monthly Book Additions
            </h3>
          </div>
          <div className="h-64 flex items-end justify-between px-4 gap-2 border-b border-outline-variant pb-2">
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-8 md:w-12 bg-primary-container/80 rounded-t-sm h-[40%] hover:bg-primary-container transition-colors relative group"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Jan
              </span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-8 md:w-12 bg-primary-container/80 rounded-t-sm h-[65%] hover:bg-primary-container transition-colors relative group"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Feb
              </span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-8 md:w-12 bg-primary-container/80 rounded-t-sm h-[30%] hover:bg-primary-container transition-colors relative group"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Mar
              </span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-8 md:w-12 bg-primary-container/80 rounded-t-sm h-[80%] hover:bg-primary-container transition-colors relative group"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Apr
              </span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-8 md:w-12 bg-primary-container/80 rounded-t-sm h-[50%] hover:bg-primary-container transition-colors relative group"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                May
              </span>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-8 md:w-12 bg-primary-container/80 rounded-t-sm h-[90%] hover:bg-primary-container transition-colors relative group"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Jun
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest rounded-lg border border-outline-variant p-md shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Catalog by Genre
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-40 h-40 rounded-full border-[16px] border-surface-container-high relative flex items-center justify-center">
              <div
                className="absolute inset-[-16px] rounded-full border-[16px] border-transparent"
                style={{
                  borderTopColor: "#10b981",
                  borderRightColor: "#94a4bd",
                  borderBottomColor: "#bec6e0",
                  borderLeftColor: "#dde4dd",
                  transform: "rotate(45deg)",
                }}
              ></div>
              <div className="bg-surface-container-lowest w-full h-full rounded-full absolute"></div>
              <span className="font-headline-sm text-headline-sm text-on-surface z-10">
                All
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 font-body-md text-body-md">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#10b981]"></span>Fiction
              (40%)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#94a4bd]"></span>Science
              (25%)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#bec6e0]"></span>History
              (20%)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#dde4dd]"></span>Bio (15%)
            </div>
          </div>
        </div>
      </div>

      {/* Recent Additions Table */}
      <div className="space-y-sm">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Recent Book Additions
        </h3>
        <BookTable books={books} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default DashboardPage;

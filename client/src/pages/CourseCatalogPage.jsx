import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FilterBar from "../components/courses/FilterBar.jsx";
import CourseGrid from "../components/courses/CourseGrid.jsx";
import { getCourses } from "../services/api.js";

const COURSE_CATEGORIES = {
  "Introduction to Python": "Programming",
  "Advanced React & Tailwind": "Programming",
  "UI/UX Design Fundamentals": "Design",
  "Data Science with R": "Programming",
  "Digital Marketing Masterclass": "Marketing",
  "Product Management 101": "Business",
};

export default function CourseCatalogPage({ onViewDetails }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses(0, 100);
        setCourses(data);
        setError(null);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and sort logic
  const filteredCourses = courses.filter((course) => {
    // Search query filter
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor_name.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const courseCategory = COURSE_CATEGORIES[course.title] || "Programming";
    const matchesCategory = category === "All" || courseCategory === category;

    // Price filter
    const matchesPrice =
      priceFilter === "All" ||
      (priceFilter === "Free" && course.price === 0) ||
      (priceFilter === "Paid" && course.price > 0);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "LowToHigh") {
      return a.price - b.price;
    }
    if (sortBy === "HighToLow") {
      return b.price - a.price;
    }
    // Default: Popular (keep original order or sort by title)
    return a.title.localeCompare(b.title);
  });

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse,
  );
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col gap-stack-lg">
      {/* Hero Banner */}
      <section className="w-full min-h-[200px] rounded-lg bg-gradient-to-r from-surface-container-high to-surface-container flex flex-col md:flex-row items-center justify-between p-stack-lg overflow-hidden relative border border-outline-variant">
        <div className="flex flex-col gap-stack-sm z-10 max-w-2xl">
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface">
            Expand Your Knowledge
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Discover top-rated courses taught by industry experts. Learn at your
            own pace in a distraction-free environment.
          </p>
        </div>
        <div className="z-10 mt-stack-md md:mt-0 opacity-80 mix-blend-multiply">
          <img
            className="w-48 h-auto object-contain"
            alt="A clean, minimalist 3D illustration of an open laptop surrounded by stacked books and geometric abstract shapes."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4lFvjz5eZt_n8xK-RtalL99kcFXQru5bzACjD_V3UxAyw95xV0f0q2DDXrDCDE1dnl5J8cdmZGa8vwCgnwcWgEZmT20i1lcO7ExNcAzMmri30ImvUSgoQKfYP2nk6cMWp3ykZE2_o3WQDHDtS4JB-Emh6xrKN6HquJNcdc6Kq2sIpBiNdAW0qIJjeRXCf6JJywwlcVXcd3teqj98kXwHrFNjFvOey0w19nHXEFooEdnE_Tewy3-CowZ3W7xed02ssCWjbOc2FXR1V"
          />
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val);
          setCurrentPage(1);
        }}
        priceFilter={priceFilter}
        onPriceFilterChange={(val) => {
          setPriceFilter(val);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(val) => {
          setSortBy(val);
          setCurrentPage(1);
        }}
      />

      {/* Course Grid or Loading/Error */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-body-lg text-on-surface-variant">
            Loading courses...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-error-container border border-error rounded-lg p-4">
          <p className="text-body-lg text-on-error-container">{error}</p>
        </div>
      ) : (
        <>
          <CourseGrid courses={currentCourses} onViewDetails={onViewDetails} />

          {/* Pagination */}
          {totalPages > 1 && (
            <section className="flex justify-center items-center gap-2 mt-stack-lg">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 border border-outline-variant rounded flex items-center ${currentPage === 1 ? "text-outline cursor-not-allowed opacity-50" : "text-on-surface hover:bg-surface-container-low transition-colors"}`}
              >
                <span
                  className="material-symbols-outlined"
                  data-icon="chevron_left"
                >
                  chevron_left
                </span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded font-label-md text-label-md transition-colors ${currentPage === page ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface hover:bg-surface-container-low"}`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 border border-outline-variant rounded flex items-center ${currentPage === totalPages ? "text-outline cursor-not-allowed opacity-50" : "text-on-surface hover:bg-surface-container-low transition-colors"}`}
              >
                <span
                  className="material-symbols-outlined"
                  data-icon="chevron_right"
                >
                  chevron_right
                </span>
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}

CourseCatalogPage.propTypes = {
  onViewDetails: PropTypes.func.isRequired,
};

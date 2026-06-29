import React from "react";
import PropTypes from "prop-types";
import CourseCard from "./CourseCard.jsx";

export default function CourseGrid({ courses, onViewDetails }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-surface border border-outline-variant rounded-lg">
        <p className="text-body-lg text-on-surface-variant">
          No courses found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onViewDetails={onViewDetails}
        />
      ))}
    </section>
  );
}

CourseGrid.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      instructor_name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

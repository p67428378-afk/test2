import React, { useState } from "react";
import PropTypes from "prop-types";
import FloatingEnrollmentCard from "../components/courses/FloatingEnrollmentCard.jsx";
import AccordionItem from "../components/courses/AccordionItem.jsx";

export default function CourseDetailsPage({ course, onBack }) {
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = () => {
    setEnrolled(true);
    alert(`Successfully enrolled in ${course.title}!`);
  };

  return (
    <div className="flex flex-col gap-stack-lg">
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity font-medium"
        >
          <span className="material-symbols-outlined" data-icon="arrow_back">
            arrow_back
          </span>
          <span>Back to Courses</span>
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-gutter relative">
        {/* Left Column: Course Info */}
        <div className="flex-grow lg:max-w-[70%] flex flex-col gap-stack-lg">
          <div className="flex flex-col gap-stack-sm">
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-wider font-semibold">
              Course Details
            </span>
            <h1 className="text-headline-lg font-headline-lg text-on-surface font-bold">
              {course.title}
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              {course.description || "No description available."}
            </p>
          </div>

          {/* Instructor Info */}
          <div className="flex items-center gap-4 bg-surface border border-outline-variant rounded-lg p-stack-md">
            <div className="w-12 h-12 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-headline-md">
              {course.instructor_name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-label-sm font-label-sm text-outline">
                Instructor
              </span>
              <span className="text-body-lg font-semibold text-on-surface">
                {course.instructor_name}
              </span>
            </div>
          </div>

          {/* Course Curriculum */}
          <div className="flex flex-col gap-stack-md">
            <h2 className="text-headline-md font-headline-md text-on-surface font-bold">
              Course Curriculum
            </h2>
            <div className="flex flex-col gap-4">
              <AccordionItem title="Section 1: Getting Started">
                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[18px] text-outline"
                      data-icon="play_circle"
                    >
                      play_circle
                    </span>
                    <span>1.1 Course Introduction</span>
                  </span>
                  <span className="text-label-sm text-outline">05:20</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[18px] text-outline"
                      data-icon="play_circle"
                    >
                      play_circle
                    </span>
                    <span>1.2 Setting Up Your Environment</span>
                  </span>
                  <span className="text-label-sm text-outline">12:45</span>
                </div>
              </AccordionItem>

              <AccordionItem title="Section 2: Core Concepts">
                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[18px] text-outline"
                      data-icon="play_circle"
                    >
                      play_circle
                    </span>
                    <span>2.1 Fundamental Principles</span>
                  </span>
                  <span className="text-label-sm text-outline">18:15</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[18px] text-outline"
                      data-icon="play_circle"
                    >
                      play_circle
                    </span>
                    <span>2.2 Practical Examples</span>
                  </span>
                  <span className="text-label-sm text-outline">22:30</span>
                </div>
              </AccordionItem>

              <AccordionItem title="Section 3: Advanced Topics & Best Practices">
                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[18px] text-outline"
                      data-icon="play_circle"
                    >
                      play_circle
                    </span>
                    <span>3.1 Optimization Techniques</span>
                  </span>
                  <span className="text-label-sm text-outline">15:40</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[18px] text-outline"
                      data-icon="play_circle"
                    >
                      play_circle
                    </span>
                    <span>3.2 Real-world Case Studies</span>
                  </span>
                  <span className="text-label-sm text-outline">25:10</span>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Enrollment Card */}
        <div className="w-full lg:w-[30%] flex-shrink-0">
          <FloatingEnrollmentCard course={course} onEnroll={handleEnroll} />
          {enrolled && (
            <div className="mt-4 p-4 bg-surface border border-primary rounded-lg text-center">
              <p className="text-body-md text-primary font-semibold">
                🎉 You are enrolled in this course!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CourseDetailsPage.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    instructor_name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

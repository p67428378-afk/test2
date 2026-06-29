import React from "react";
import PropTypes from "prop-types";

export default function FloatingEnrollmentCard({ course, onEnroll }) {
  return (
    <div className="bg-surface border border-outline-variant rounded-lg p-stack-lg shadow-md flex flex-col gap-stack-md sticky top-24">
      <div className="flex flex-col gap-1">
        <span className="text-label-sm font-label-sm text-primary uppercase tracking-wider">
          Full Lifetime Access
        </span>
        <span className="text-display-lg-mobile font-display-lg-mobile text-on-surface font-bold">
          ${course.price}
        </span>
      </div>

      <button
        onClick={onEnroll}
        className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity shadow-sm"
      >
        Enroll Now
      </button>

      <div className="flex flex-col gap-stack-sm border-t border-outline-variant pt-stack-md mt-2">
        <h4 className="text-label-md font-label-md font-semibold text-on-surface">
          This course includes:
        </h4>
        <ul className="flex flex-col gap-2 text-body-md text-on-surface-variant">
          <li className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[18px] text-primary"
              data-icon="play_circle"
            >
              play_circle
            </span>
            <span>12 hours on-demand video</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[18px] text-primary"
              data-icon="description"
            >
              description
            </span>
            <span>8 downloadable resources</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[18px] text-primary"
              data-icon="assignment"
            >
              assignment
            </span>
            <span>Full lifetime access</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[18px] text-primary"
              data-icon="devices"
            >
              devices
            </span>
            <span>Access on mobile and TV</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[18px] text-primary"
              data-icon="emoji_events"
            >
              emoji_events
            </span>
            <span>Certificate of completion</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

FloatingEnrollmentCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    instructor_name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onEnroll: PropTypes.func.isRequired,
};

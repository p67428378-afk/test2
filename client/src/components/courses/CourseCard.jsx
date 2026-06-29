import React from "react";
import PropTypes from "prop-types";

const COURSE_IMAGES = {
  "Introduction to Python":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDJEb9z592LrB00Wu1ewu7paYC-wfhJ9SPOixKYe0Iy5jRk21F3ueEUY5RcaFK0dHcKw-3HBVUk467XPR11SuNGwpJvhIKozOiRbrZOTa-tp1_gWJ2iBA349fklMEIgxgM9ha8hK63zzUU2MzhXcIzqW7nQ0hFJP8jw2SG3BtlMOHGW7ORz1_6WQ7F1RoVbnTZXORLx5cN4y0qjKSU7adOItu-oOBuUMComgOD9VCSabpvq5ZANEy2sZxdDMljAiM5wn8ye_vgEVbTN",
  "Advanced React & Tailwind":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCj5-2zj6w4MvV87jWc82zkyLBEZHgz3DG6oUK9ThqIxykFCRST0o3e7fFJSnYCWsbRVtUpBnUvIqqUpQEwBYMxCD_ZsRG2g3TJVsYLa7guHf8O_C2PZbyhfezQMITmPPeNdoIOiYFoX_ofmMxBkM1ghUUbDitMY3dzhip8r9ET-aL7Me7RAkO7ChpFyvzdKFAUXGNhEi5VFAlxd-LhpJFmgT0orbdAy11I3qewKejDv7j6gc2BgJXHkTsF9ZUjWdwKXDU9CYRJZc-j",
  "UI/UX Design Fundamentals":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDzZmoRasMHusWdocsJfP4r2puwK3dsq4iaCakTLwIx7ITPL7dmTw3WaSuX-Ltk5rt-aUT4ZADGkxz2-nJ9S-oqtrys9stG7czbM00KO-MqQTuE_MhPOUMU8haJJVsbTwbf_Cp62ATbUWMJxQeiqmW_6zv0ptOip06NHBAt5GteGPGynjPcjonSFuxKhUCtBrIpOn1QcDQC4IytMPVQsAaXkhbQXSN9kaJNW1Osdl5Ud_YRvWRV-XJf-7eTv2lpXAx6mxYG6NEZeJo_",
  "Data Science with R":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCkw6lJdkdXTSQL4M7i0m03oE1sKHKZdxRz9O9shTr0s6EyUz8BIFioruYEM3dv--v35TOZJZQwRkAH8937DYnrt4PmpnxvYievmv0gtQyMwfZ4CVtRFWJJmrPkKYPYCE4OxG2ZejNkGU87VO2tGF4Oj8a7l534UzFP8j2ag4WgIW2RFZb4La8JRH3YTj_ZX1BZ6f07NRPfI0yCjkOo6CjfSZ7E64rFoGQkvUGgD__QR9hOeFJvEO2wUprgzIscy1_vRYyV_x6nW9Il",
  "Digital Marketing Masterclass":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCKQWp9xE-tL-6j9vudDM1GIesCvWOjYx73xOsm6Ut5hLSL0zBRgITYNhad_jdw6ApsnpnxYiU7w7OFaJjETNjbTkz8q7Ys-DhOWaTOigpVHIsiG7X0RKzTG0L7lPG7EloA0euOO-HwW741D_aqjit4qIgcVYGDkPcMnLILTXANys8yuY8KV4hGJFLzSYhckbxY9KxHXSHz-KsNk493X0AHdKXKE6w-qrfxoDlVMnR0Y2Fdg1gyV4bMir4G05CGy978R4HxCCeLrQUx",
  "Product Management 101":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBXdT8Zy10d8U_35hXYq8XxHS8RVWWr8fg4tZDpzswm0MOjNzyojell3mf0Et0uAidpB71U1AMh0DlhLy-YsLlvxj8jCvK8MhQ1FgEnl5anJWCboJuQhZWEg2WXRjrOy0zFf9euiSb4ZIbSwjWk-qJaQ9aSafzVGeFKTz_-_IEjHsINfyHsga70ldmfjED9lH0I8YI1BstYkA2qDiS78wfZKrAxkpedOJbw1xXHixk1xePyjzrlJDJgEEXOSyhLoiGujbXbui9Y8nAs",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60";

export default function CourseCard({ course, onViewDetails }) {
  const imageUrl = COURSE_IMAGES[course.title] || DEFAULT_IMAGE;

  // Determine badges based on title
  const isBestSeller =
    course.title === "Introduction to Python" ||
    course.title === "Product Management 101";
  const isNew = course.title === "Advanced React & Tailwind";

  return (
    <article className="bg-surface border border-outline-variant rounded-lg overflow-hidden group hover:shadow-md hover:border-primary transition-all duration-300 flex flex-col h-full">
      <div
        className="h-40 w-full relative bg-cover bg-center"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      >
        {isBestSeller && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-surface-container-low text-primary rounded-full text-label-sm font-label-sm flex items-center gap-1 border border-primary-fixed-dim shadow-sm">
            <span
              className="material-symbols-outlined text-[14px]"
              data-icon="local_fire_department"
            >
              local_fire_department
            </span>{" "}
            Best Seller
          </div>
        )}
        {isNew && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-surface-container-low text-primary rounded-full text-label-sm font-label-sm border border-primary-fixed-dim shadow-sm">
            New
          </div>
        )}
      </div>
      <div className="p-stack-md flex flex-col flex-grow gap-stack-sm">
        <h3 className="text-body-lg font-body-lg font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-label-md font-label-md text-on-surface-variant flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[16px]"
            data-icon="person"
          >
            person
          </span>{" "}
          {course.instructor_name}
        </p>
        <div className="flex items-center gap-1 text-label-md font-label-md text-on-surface-variant mt-auto">
          <span
            className="material-symbols-outlined text-[16px] text-[#F59E0B]"
            data-icon="star"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-medium text-on-surface">4.8</span>
          <span>(1,240 reviews)</span>
        </div>
      </div>
      <div className="p-stack-md border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
        <span className="text-headline-md font-headline-md text-on-surface">
          ${course.price}
        </span>
        <button
          onClick={() => onViewDetails(course)}
          className="px-4 py-2 border border-outline-variant text-on-surface hover:bg-surface-container-low rounded font-label-md text-label-md transition-colors"
        >
          View Course
        </button>
      </div>
    </article>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    instructor_name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

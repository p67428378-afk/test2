import React, { useState } from "react";
import TopNavBar from "./components/layout/TopNavBar.jsx";
import Footer from "./components/layout/Footer.jsx";
import CourseCatalogPage from "./pages/CourseCatalogPage.jsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx";

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
  };

  const handleBackToCatalog = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="bg-background text-on-background antialiased font-body-md min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full py-stack-lg flex flex-col gap-stack-lg">
        {selectedCourse ? (
          <CourseDetailsPage
            course={selectedCourse}
            onBack={handleBackToCatalog}
          />
        ) : (
          <CourseCatalogPage onViewDetails={handleViewDetails} />
        )}
      </main>

      <Footer />
    </div>
  );
}

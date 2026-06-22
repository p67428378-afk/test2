import React, { useState, useEffect } from "react";
import PhotoGrid from "../components/portfolio/PhotoGrid.jsx";
import Lightbox from "../components/portfolio/Lightbox.jsx";
import { getGalleries, getGalleryImages } from "../services/api";

export default function PortfolioPage() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [filteredImages, setImagesFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const galleriesData = await getGalleries();
        setCategories(galleriesData);

        // Fetch images for all galleries
        const allImagesPromises = galleriesData.map(async (gallery) => {
          const galleryImages = await getGalleryImages(gallery.id);
          return galleryImages.map((img) => ({
            ...img,
            gallery_name: gallery.name,
          }));
        });

        const allImagesResults = await Promise.all(allImagesPromises);
        const flattenedImages = allImagesResults.flat();
        setImages(flattenedImages);
        setImagesFiltered(flattenedImages);
      } catch {
        setError("Failed to load portfolio galleries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === "All") {
      setImagesFiltered(images);
    } else {
      setImagesFiltered(
        images.filter((img) => img.gallery_name === categoryName),
      );
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    if (currentIndex !== -1 && currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    } else if (filteredImages.length > 0) {
      setSelectedImage(filteredImages[0]); // Loop back to start
    }
  };

  const handlePrevImage = () => {
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    if (currentIndex !== -1 && currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    } else if (filteredImages.length > 0) {
      setSelectedImage(filteredImages[filteredImages.length - 1]); // Loop to end
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXx7xKBeX-DbYTtQGG4L94d8xRhnkk9oUbPBR50W-CRKD5UVme9tHOeVavXXHXh0YO15xgpFr-MJhislS9IihrG3Hm-MbrKQxlKYP8eyVk-Zkh9zxK_gyYE6Vtf1sFnsu7lq6vKlfreWYZNjMAM2nnPdYMl3SbFnZ6KlhRwtcxfhm7_DoTvxxXe3qSWwIzzD4BUCKkBozoVsthE3w5m8Ed9zHS19CdmkoIw_NxFccw202PKHIWZn0-ik66vF52KyS1GZ2o2mAVdbk')",
          }}
        >
          <div className="absolute inset-0 bg-primary/40"></div>
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-4xl mx-auto">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-stack-md">
            Capturing Life's Most Beautiful Moments
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-high max-w-2xl mx-auto">
            Professional photography specializing in Nature, Weddings, and
            Portraits.
          </p>
        </div>
      </section>

      {/* Portfolio Section */}
      <main className="flex-grow py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-error font-body-lg">
            {error}
          </div>
        ) : (
          <PhotoGrid
            images={filteredImages}
            onImageClick={handleImageClick}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </main>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={handleCloseLightbox}
          onNext={filteredImages.length > 1 ? handleNextImage : null}
          onPrev={filteredImages.length > 1 ? handlePrevImage : null}
        />
      )}
    </div>
  );
}

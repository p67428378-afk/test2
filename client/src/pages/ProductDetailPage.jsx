import React, { useState, useEffect } from "react";
import { productService, wishlistService, cartService } from "../services/api";

export default function ProductDetailPage({
  productId,
  wishlist,
  onUpdateWishlist,
  onUpdateCart,
  onNavigate,
}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product details", err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const isProductInWishlist = () => {
    return wishlist.some((item) => item.product_id === productId);
  };

  const handleToggleWishlist = async () => {
    const inWishlist = isProductInWishlist();
    try {
      if (inWishlist) {
        await wishlistService.removeFromWishlist(productId);
      } else {
        await wishlistService.addToWishlist(productId);
      }
      const updated = await wishlistService.getWishlist();
      onUpdateWishlist(updated);
    } catch (err) {
      alert("Please login to manage your wishlist.");
    }
  };

  const handleAddToCart = async () => {
    try {
      await cartService.updateCart(productId, quantity);
      const updated = await cartService.getCart();
      onUpdateCart(updated);
      alert("Product added to cart!");
    } catch (err) {
      alert("Please login to add items to your cart.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 flex-grow">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 flex-grow">
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mb-4">
          Product not found
        </h2>
        <button
          onClick={() => onNavigate("catalog")}
          className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-fixed transition-colors border-none cursor-pointer"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const inWishlist = isProductInWishlist();

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-8">
        <span
          onClick={() => onNavigate("catalog")}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Home
        </span>
        <span className="material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <span
          onClick={() => onNavigate("catalog")}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Clothing
        </span>
        <span className="material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <span className="text-on-surface font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-12">
        {/* Left: Product Image */}
        <div className="relative aspect-[3/4] bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleToggleWishlist}
            className="absolute top-4 right-4 w-10 h-10 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform border-none cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[24px] ${inWishlist ? "text-error" : "text-on-surface-variant hover:text-error"}`}
              style={inWishlist ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
              {product.brand}
            </p>
            <h1 className="font-display text-display text-on-surface mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[20px] text-[#FBBF24]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {product.rating || "4.5"}
                </span>
              </div>
              <span className="text-outline-variant">|</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {product.reviews ? product.reviews.length : 0} Customer Reviews
              </span>
            </div>

            <div className="font-display text-display font-bold text-primary mb-6">
              ${Number(product.price).toFixed(2)}
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Size & Color Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
                  Size
                </span>
                <span className="inline-block px-4 py-2 border border-outline-variant rounded-md font-body-md text-body-md text-on-surface bg-surface-container-low">
                  {product.size}
                </span>
              </div>
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
                  Color
                </span>
                <span className="inline-block px-4 py-2 border border-outline-variant rounded-md font-body-md text-body-md text-on-surface bg-surface-container-low">
                  {product.color}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Quantity:
              </span>
              <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-surface-container-low transition-colors border-none cursor-pointer font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 font-body-md text-body-md text-on-surface min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 hover:bg-surface-container-low transition-colors border-none cursor-pointer font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-on-primary font-headline-sm text-headline-sm py-4 rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors border-none cursor-pointer"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Description & Reviews */}
      <div className="border-t border-outline-variant pt-8">
        <div className="flex gap-8 border-b border-outline-variant mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 font-label-md text-label-md cursor-pointer bg-transparent border-none ${activeTab === "description" ? "text-primary font-semibold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 font-label-md text-label-md cursor-pointer bg-transparent border-none ${activeTab === "reviews" ? "text-primary font-semibold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}
          >
            Reviews ({product.reviews ? product.reviews.length : 0})
          </button>
        </div>

        {activeTab === "description" ? (
          <div className="prose max-w-none font-body-md text-body-md text-on-surface-variant space-y-4">
            <p>{product.description}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Premium quality fabric and stitching</li>
              <li>Designed for comfort and modern style</li>
              <li>Available in multiple sizes and colors</li>
              <li>Easy care and machine washable</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-surface-container-low p-6 rounded-lg border border-outline-variant"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface font-semibold">
                        {review.user_name}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[16px]"
                          style={{
                            fontVariationSettings:
                              i < review.rating ? "'FILL' 1" : "'FILL' 0",
                            color: i < review.rating ? "#FBBF24" : "#C7C4D8",
                          }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-surface-container-low rounded-lg border border-outline-variant">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

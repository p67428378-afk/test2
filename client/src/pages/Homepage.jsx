import React from "react";
import {
  Cpu,
  Layers,
  HardDrive,
  Monitor,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import Button from "../components/common/Button.jsx";

export default function Homepage({
  categories = [],
  onNavigate,
  setSelectedCategory,
  featuredProducts = [],
}) {
  // Fallback icon based on category name
  const getCategoryIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("cpu") || lowerName.includes("processor")) {
      return <Cpu className="h-8 w-8 text-cyan-400" />;
    } else if (
      lowerName.includes("gpu") ||
      lowerName.includes("graphics") ||
      lowerName.includes("video")
    ) {
      return <Monitor className="h-8 w-8 text-cyan-400" />;
    } else if (
      lowerName.includes("ssd") ||
      lowerName.includes("hdd") ||
      lowerName.includes("storage")
    ) {
      return <HardDrive className="h-8 w-8 text-cyan-400" />;
    } else {
      return <Layers className="h-8 w-8 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-16 md:px-12 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent_40%)]" />
        <div className="relative max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-medium text-cyan-400">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            New RTX 50-Series In Stock
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 md:text-6xl">
            Forge Your Ultimate{" "}
            <span className="text-cyan-400">Battle Station</span>
          </h1>
          <p className="text-lg text-slate-400">
            Premium computer components for casual builders and high-end
            enthusiasts. Expertly curated, fully compatible, and ready to ship.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              onClick={() => {
                setSelectedCategory(null);
                onNavigate("listings");
              }}
              className="px-6 py-3 text-base"
            >
              Browse All Parts
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
          <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Free Express Shipping</h3>
            <p className="text-sm text-slate-400 mt-1">
              On all orders over $150. Fully insured delivery.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
          <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">
              Compatibility Guarantee
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Use our builder to ensure 100% part compatibility.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
          <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
            <RotateCcw className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">
              30-Day Hassle-Free Returns
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              No questions asked returns on unopened items.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">
            Browse by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                onNavigate("listings");
              }}
              className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/30 p-6 text-center transition-all hover:border-cyan-500/50 hover:bg-slate-900/50"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
                {getCategoryIcon(cat.name)}
              </div>
              <h3 className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {cat.description || "Explore premium parts."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-100">
              Featured Components
            </h2>
            <button
              onClick={() => {
                setSelectedCategory(null);
                onNavigate("listings");
              }}
              className="text-sm font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                onClick={() => onNavigate(`details:${product.id}`)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 transition-all hover:border-cyan-500/50"
              >
                <div className="flex h-40 items-center justify-center bg-slate-950 p-6">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-900/50">
                      {getCategoryIcon(product.name)}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {product.brand}
                  </div>
                  <h3 className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="mt-2 text-lg font-extrabold text-cyan-400">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

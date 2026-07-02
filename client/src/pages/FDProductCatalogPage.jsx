import React, { useEffect, useState } from "react";
import { getFDProducts } from "../services/api";
import ProductCard from "../components/fd/ProductCard";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function FDProductCatalogPage({
  onNext,
  selectedProduct,
  setSelectedProduct,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getFDProducts();
        setProducts(data.products || []);
        if (data.products && data.products.length > 0 && !selectedProduct) {
          setSelectedProduct(data.products[0]);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load Fixed Deposit products. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Open a Fixed Deposit
        </h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Earn guaranteed high interest on your idle savings instantly.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
          Select a Plan
        </h3>
        <div className="grid gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              isSelected={selectedProduct?.id === product.id}
            />
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={!selectedProduct}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Configure Deposit</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

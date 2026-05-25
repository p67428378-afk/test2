import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/common/Card';

const CreditCardProductCard = ({ product }) => (
  <Card className="flex flex-col">
    <img src={product.image_url} alt={product.product_name} className="rounded-md mb-4" />
    <h3 className="text-xl font-bold mb-2">{product.product_name}</h3>
    <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
    <div className="text-sm">
      <p><strong>Interest Rate:</strong> {product.interest_rate}%</p>
      <p><strong>Annual Fee:</strong> ${product.annual_fee}</p>
      <p><strong>Credit Limit:</strong> {product.credit_limit_range}</p>
    </div>
  </Card>
);

const EligibleCardOptionsPage = () => {
  const { applicationId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/api/v1/applications/${applicationId}/status`);
        setProducts(response.data.eligible_products);
      } catch (error) {
        console.error('Failed to fetch eligible products', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [applicationId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Eligible Credit Card Options</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <CreditCardProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg">No eligible card options found.</p>
      )}
    </div>
  );
};

export default EligibleCardOptionsPage;

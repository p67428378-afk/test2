import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/common/Card';
import ButtonPrimary from '../components/common/ButtonPrimary';

const EligibilityResultPage = () => {
  const { applicationId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/api/v1/applications/${applicationId}/status`);
        setResult(response.data);
      } catch (error) {
        console.error('Failed to fetch eligibility result', error);
      }
      setLoading(false);
    };

    fetchResult();
  }, [applicationId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!result) {
    return <div className="text-center">Could not retrieve application status.</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">
        Application Status: <span className={result.eligibility_status === 'Eligible' ? 'text-success' : 'text-error'}>{result.eligibility_status}</span>
      </h2>
      {result.eligibility_status === 'Ineligible' && (
        <p className="text-lg mb-6">Reason: {result.ineligibility_reason}</p>
      )}
      {result.eligibility_status === 'Eligible' && (
        <div className="mt-6">
          <p className="text-lg mb-4">Congratulations! You are eligible for the following credit cards.</p>
          <Link to={`/eligible-cards/${applicationId}`}>
            <ButtonPrimary>View Eligible Cards</ButtonPrimary>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default EligibilityResultPage;

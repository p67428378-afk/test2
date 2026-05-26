import React from 'react';
import { useParams } from 'react-router-dom';

const CampaignDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className='bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30'>
      <h1 className='font-headline-lg text-headline-lg text-on-surface'>Campaign Details</h1>
      <p className='text-body-md text-on-surface-variant'>Details for campaign ID: {id} will be displayed here.</p>
      {/* TODO: Fetch and display campaign details from /api/v1/campaigns/{id} */}
    </div>
  );
};

export default CampaignDetailsPage;

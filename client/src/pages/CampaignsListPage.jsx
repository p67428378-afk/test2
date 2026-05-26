import React from 'react';

const CampaignsListPage = () => {
  return (
    <div className='bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30'>
      <h1 className='font-headline-lg text-headline-lg text-on-surface'>Campaigns</h1>
      <p className='text-body-md text-on-surface-variant'>A list of all campaigns will be displayed here.</p>
      {/* TODO: Fetch and display campaigns from /api/v1/campaigns */}
    </div>
  );
};

export default CampaignsListPage;

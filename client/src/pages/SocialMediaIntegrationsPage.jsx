import React from 'react';

const SocialMediaIntegrationsPage = () => {
  return (
    <div className='bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30'>
      <h1 className='font-headline-lg text-headline-lg text-on-surface'>Social Media Integrations</h1>
      <p className='text-body-md text-on-surface-variant'>A list of all social media integrations will be displayed here.</p>
      {/* TODO: Fetch and display integrations from /api/v1/social-media-accounts */}
    </div>
  );
};

export default SocialMediaIntegrationsPage;

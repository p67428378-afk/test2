import React from 'react';

const PlatformIcon = ({ platform, connected }) => {
    let iconName = 'devices';
    let color = connected ? 'text-on-surface' : 'text-outline';
    if (platform.toLowerCase() === 'instagram') {
        iconName = 'photo_camera';
        color = 'text-pink-600';
    }
    if (platform.toLowerCase() === 'youtube') {
        iconName = 'smart_display';
        color = 'text-red-600';
    }
    if (platform.toLowerCase() === 'tiktok') {
        iconName = 'music_note';
        color = 'text-on-surface';
    }

    return (
        <div className={`w-12 h-12 rounded-lg ${connected ? 'bg-pink-50' : 'bg-surface-container'} flex items-center justify-center`}>
            <span className={`material-icons ${color} text-[32px]`}>{iconName}</span>
        </div>
    );
}

const SocialMediaIntegrationCard = ({ account, onConnect, onDisconnect }) => {
  const { platform, username, connected } = account;

  return (
    <div className='bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-lg'>
      <PlatformIcon platform={platform} connected={connected} />
      <div className='flex-1'>
        <p className='font-label-md text-label-md text-on-surface-variant'>{connected ? username : `Not Connected`}</p>
        <span className={`font-label-sm text-label-sm ${connected ? 'text-[#059669]' : 'text-outline'} flex items-center gap-xs`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-[#059669]' : 'bg-outline'}`}></span>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      {connected ? (
        <button onClick={() => onDisconnect(account.id)} className='px-md py-xs border border-outline text-on-surface-variant font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors'>
          Disconnect
        </button>
      ) : (
        <button onClick={() => onConnect(platform)} className='px-md py-xs bg-primary text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity'>
          Connect
        </button>
      )}
    </div>
  );
};

export default SocialMediaIntegrationCard;

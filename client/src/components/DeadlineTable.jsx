import React from 'react';

const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case 'approaching':
      return <span className='inline-flex items-center px-sm py-xs rounded-full bg-amber-100 text-[#F59E0B] font-label-sm text-label-sm font-bold'>Approaching</span>;
    case 'overdue':
      return <span className='inline-flex items-center px-sm py-xs rounded-full bg-error-container text-[#EF4444] font-label-sm text-label-sm font-bold'>Overdue</span>;
    case 'pending':
    default:
      return <span className='inline-flex items-center px-sm py-xs rounded-full bg-surface-variant text-outline font-label-sm text-label-sm font-bold'>Pending</span>;
  }
};

const PlatformIcon = ({ platform }) => {
    let iconName = 'devices';
    if (platform.toLowerCase() === 'instagram') iconName = 'photo_camera';
    if (platform.toLowerCase() === 'youtube') iconName = 'smart_display';
    if (platform.toLowerCase() === 'tiktok') iconName = 'music_note';

    return (
        <span className='flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant'>
            <span className='material-icons text-[18px]'>{iconName}</span>
            {platform}
        </span>
    );
}

const DeadlineTable = ({ deadlines }) => {
  return (
    <section className='bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden'>
      <div className='p-lg flex justify-between items-center border-b border-surface-variant'>
        <h2 className='font-headline-md text-headline-md text-on-surface'>Upcoming Content Deadlines</h2>
        <button className='text-primary font-label-md text-label-md hover:underline'>View Calendar</button>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left'>
          <thead>
            <tr className='bg-surface-container-low'>
              <th className='px-lg py-md font-label-md text-label-md text-outline'>Deliverable</th>
              <th className='px-lg py-md font-label-md text-label-md text-outline'>Campaign</th>
              <th className='px-lg py-md font-label-md text-label-md text-outline'>Platform</th>
              <th className='px-lg py-md font-label-md text-label-md text-outline'>Due Date</th>
              <th className='px-lg py-md font-label-md text-label-md text-outline'>Status</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-surface-variant'>
            {deadlines.map((item, index) => (
              <tr key={index} className='hover:bg-surface-dim/20 transition-colors'>
                <td className='px-lg py-md font-body-md text-body-md text-on-surface font-medium'>{item.deliverable}</td>
                <td className='px-lg py-md font-body-md text-body-md text-on-surface-variant'>{item.campaign}</td>
                <td className='px-lg py-md'><PlatformIcon platform={item.platform} /></td>
                <td className={`px-lg py-md font-body-md text-body-md text-on-surface-variant ${item.status.toLowerCase() === 'overdue' ? 'text-error font-semibold' : ''}`}>
                    {new Date(item.dueDate).toLocaleDateString()}
                </td>
                <td className='px-lg py-md'>{getStatusBadge(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DeadlineTable;

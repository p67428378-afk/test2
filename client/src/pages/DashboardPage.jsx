import React, { useState, useEffect } from 'react';
import OverviewCard from '../components/OverviewCard';
import DeadlineTable from '../components/DeadlineTable';
import EngagementChart from '../components/EngagementChart';
import SocialMediaIntegrationCard from '../components/SocialMediaIntegrationCard';
import * as api from '../services/api';

const DashboardPage = () => {
  // Mock data based on stitch_html - replace with API calls
  const [overview, setOverview] = useState({
    activeCampaigns: 5,
    upcomingDeadlines: 3,
    avgEngagement: '4.8%',
    engagementTrend: '+0.5%'
  });

  const [deadlines, setDeadlines] = useState([
    { deliverable: 'Instagram Post', campaign: 'Summer Fashion', platform: 'Instagram', dueDate: '2026-01-20', status: 'Approaching' },
    { deliverable: 'YouTube Video', campaign: 'Tech Review', platform: 'YouTube', dueDate: '2026-01-25', status: 'Pending' },
    { deliverable: 'TikTok Challenge', campaign: 'Snack Promo', platform: 'TikTok', dueDate: '2026-01-10', status: 'Overdue' },
    { deliverable: 'Instagram Story', campaign: 'Beauty Haul', platform: 'Instagram', dueDate: '2026-01-18', status: 'Pending' },
  ]);

  const [engagementData, setEngagementData] = useState([
      { name: '00:00', likes: 40, comments: 24, shares: 10 },
      { name: '06:00', likes: 30, comments: 13, shares: 5 },
      { name: '12:00', likes: 20, comments: 9, shares: 2 },
      { name: '18:00', likes: 27, comments: 39, shares: 20 },
      { name: '24:00', likes: 18, comments: 48, shares: 25 },
  ]);

  const [socialAccounts, setSocialAccounts] = useState([
    { id: 1, platform: 'Instagram', username: '@janedoe_official', connected: true },
    { id: 2, platform: 'YouTube', username: 'Jane Doe Vlogs', connected: true },
    { id: 3, platform: 'TikTok', username: '', connected: false },
  ]);

  // TODO: Implement API calls in useEffect
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const campaignsRes = await api.getCampaigns();
  //       // ... process data
  //     } catch (error) {
  //       console.error("Error fetching dashboard data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleConnect = (platform) => {
    console.log(`Connecting ${platform}...`);
    // TODO: Implement OAuth flow
  };

  const handleDisconnect = (id) => {
    console.log(`Disconnecting account ${id}...`);
    // TODO: Implement disconnect API call
    setSocialAccounts(socialAccounts.map(acc => acc.id === id ? { ...acc, connected: false, username: '' } : acc));
  };

  return (
    <>
      <section className='grid grid-cols-1 md:grid-cols-3 gap-lg'>
        <OverviewCard title='Active Campaigns' value={overview.activeCampaigns} subtitle='Currently running' icon='rocket_launch' iconBgColor='primary' />
        <OverviewCard title='Upcoming Deadlines' value={overview.upcomingDeadlines} subtitle='Next 7 days' icon='event_note' iconBgColor='tertiary' />
        <OverviewCard title='Avg. Engagement Rate' value={overview.avgEngagement} subtitle='Last 30 days' icon='trending_up' iconBgColor='secondary' trend={overview.engagementTrend} />
      </section>

      <DeadlineTable deadlines={deadlines} />

      <EngagementChart data={engagementData} />

      <section>
        <h2 className='font-headline-md text-headline-md text-on-surface mb-lg'>Connected Social Media Accounts</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-lg'>
          {socialAccounts.map(acc => (
            <SocialMediaIntegrationCard key={acc.id} account={acc} onConnect={handleConnect} onDisconnect={handleDisconnect} />
          ))}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;

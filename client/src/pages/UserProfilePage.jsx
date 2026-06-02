
import React from 'react';
import TopNavBar from '../components/TopNavBar';
import SideNavBar from '../components/SideNavBar';
import ProfileDetails from '../components/ProfileDetails';
import PasswordManagement from '../components/PasswordManagement';

const UserProfilePage = () => {
  // Assuming you have a way to get the current user's ID
  const userId = 'some-user-id';

  return (
    <div className='flex pt-16'>
      <TopNavBar />
      <SideNavBar />
      <main className='flex-1 md:ml-64 p-lg md:p-xl max-w-7xl mx-auto'>
        <header className='mb-xl'>
          <h1 className='font-headline-lg text-headline-lg text-primary mb-xs'>User Profile</h1>
          <p className='font-body-md text-body-md text-on-surface-variant'>Manage your account details.</p>
        </header>
        <div className='space-y-8'>
          <ProfileDetails userId={userId} />
          <PasswordManagement />
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;

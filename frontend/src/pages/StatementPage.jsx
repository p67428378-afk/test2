import React from 'react';
import Header from '../components/Header';
import AccountSummary from '../components/AccountSummary';
import DateRangeSelection from '../components/DateRangeSelection';
import BalanceOverview from '../components/BalanceOverview';
import DownloadActions from '../components/DownloadActions';
import ComplianceFooter from '../components/ComplianceFooter';
import BottomNavBar from '../components/BottomNavBar';

const StatementPage = () => {
  return (
    <>
      <Header />
      <main className='pt-20 px-4 md:px-8 max-w-4xl mx-auto'>
        <AccountSummary />
        <DateRangeSelection />
        <BalanceOverview />
        <div className='w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-8'></div>
        <DownloadActions />
        <ComplianceFooter />
      </main>
      <BottomNavBar />
    </>
  );
};

export default StatementPage;

import React from 'react';
import Card from '../common/Card';
import AccountDetail from './AccountDetail';
import BalanceDisplay from './BalanceDisplay';

const AccountSummaryCard = ({ account }) => {
  if (!account) return null;

  const { account_holder_name, account_number, account_type, current_balance, currency } = account;

  return (
    <Card>
      <h2 className='text-xl font-semibold mb-4'>Account Summary</h2>
      <AccountDetail label="Account Holder" value={account_holder_name} />
      <AccountDetail label="Account Number" value={account_number} />
      <AccountDetail label="Account Type" value={account_type} />
      <BalanceDisplay currency={currency} balance={current_balance} />
    </Card>
  );
};

export default AccountSummaryCard;

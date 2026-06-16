import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AccountSummaryCard = ({ account }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const getAccountIcon = (type) => {
    // In a real app, you might have different icons
    return '🏦'; 
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-on-surface capitalize">
            {account.account_type.replace('_', ' ')} Account
          </h3>
          <span className="text-2xl">{getAccountIcon(account.account_type)}</span>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">**** **** **** {account.account_number.slice(-4)}</p>
        <p className="text-3xl font-bold text-on-surface">{formatCurrency(account.balance)}</p>
      </div>
      <Link 
        to={`/accounts/${account.account_id}`}
        className="mt-6 flex items-center justify-end text-sm font-medium text-primary hover:underline"
      >
        View Details <ArrowRight size={16} className="ml-1" />
      </Link>
    </div>
  );
};

export default AccountSummaryCard;

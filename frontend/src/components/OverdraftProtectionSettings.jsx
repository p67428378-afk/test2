import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000'; // Assuming backend runs on port 8000

const OverdraftProtectionSettings = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [linkedSavingsAccount, setLinkedSavingsAccount] = useState('');
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);
  const [overdraftHistory, setOverdraftHistory] = useState([]);
  const [availableSavingsAccounts, setAvailableSavingsAccounts] = useState([]);
  const customerId = 'cust123'; // Hardcoded for now, should come from auth context

  useEffect(() => {
    // Fetch initial settings and data
    fetchSettings();
    fetchOverdraftHistory();
    fetchAvailableSavingsAccounts();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch linked account status
      const linkedAccountResponse = await fetch(`${API_BASE_URL}/overdraft/linked-account/chk123`);
      if (linkedAccountResponse.ok) {
        const data = await linkedAccountResponse.json();
        setIsEnabled(data.is_enabled);
        setLinkedSavingsAccount(data.savings_account_id);
      } else {
        console.error('No linked account found or error fetching linked account.');
        setIsEnabled(false); // Assume disabled if no linked account
        setLinkedSavingsAccount('none');
      }

      // Fetch notification preferences
      const notificationResponse = await fetch(`${API_BASE_URL}/overdraft/preferences/${customerId}`);
      if (notificationResponse.ok) {
        const data = await notificationResponse.json();
        setEmailNotificationsEnabled(data.email_enabled);
        setSmsNotificationsEnabled(data.sms_enabled);
      } else {
        console.error('Error fetching notification preferences.');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchOverdraftHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/overdraft/chk123/history`);
      if (response.ok) {
        const data = await response.json();
        setOverdraftHistory(data);
      } else {
        console.error('Error fetching overdraft history.');
      }
    } catch (error) {
      console.error('Error fetching overdraft history:', error);
    }
  };

  const fetchAvailableSavingsAccounts = async () => {
    // Simulate fetching available savings accounts
    // In a real app, this would be an API call to Account Management Service
    setAvailableSavingsAccounts([
      { id: 'sav456', display: 'Savings Account (**** 5678)' },
      { id: 'sav9012', display: 'Savings Account (**** 9012)' },
    ]);
  };

  const handleToggleOverdraftProtection = async () => {
    const newStatus = !isEnabled;
    try {
      const response = await fetch(`${API_BASE_URL}/overdraft/linked-account/chk123/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: newStatus }),
      });
      if (response.ok) {
        setIsEnabled(newStatus);
      } else {
        console.error('Error updating overdraft protection status.');
      }
    } catch (error) {
      console.error('Error updating overdraft protection status:', error);
    }
  };

  const handleLinkSavingsAccount = async (e) => {
    const newSavingsAccountId = e.target.value;
    if (newSavingsAccountId === 'none') {
      // Handle unlinking if 'Do Not Link' is selected
      handleUnlinkAccount();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/overdraft/link-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          checking_account_id: 'chk123',
          savings_account_id: newSavingsAccountId,
        }),
      });
      if (response.ok) {
        setLinkedSavingsAccount(newSavingsAccountId);
        alert('Savings account linked successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error linking account: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error linking savings account:', error);
      alert('Error linking savings account.');
    }
  };

  const handleUnlinkAccount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/overdraft/unlink-account/chk123`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setLinkedSavingsAccount('none');
        setIsEnabled(false); // Also disable protection if unlinked
        alert('Account unlinked successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error unlinking account: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error unlinking account:', error);
      alert('Error unlinking account.');
    }
  };

  const handleUpdateNotificationPreferences = async (type, value) => {
    try {
      const payload = type === 'email' ? { email_enabled: value } : { sms_enabled: value };
      const response = await fetch(`${API_BASE_URL}/overdraft/preferences/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        if (type === 'email') setEmailNotificationsEnabled(value);
        else setSmsNotificationsEnabled(value);
      } else {
        console.error(`Error updating ${type} notification preference.`);
      }
    } catch (error) {
      console.error(`Error updating ${type} notification preference:`, error);
    }
  };

  return (
    <div className='font-["Roboto"] bg-[#f4f6f8] text-[#333] p-5'>
      <div className='max-w-[900px] mx-auto bg-white p-[30px] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)]'>
        <h1 className='text-[#0056b3] text-center mb-[30px] font-medium text-[2em]'>Overdraft Protection Settings</h1>

        <div className='text-[1.4em] text-[#0056b3] mt-[25px] mb-[15px] border-b-[2px] border-[#e0e0e0] pb-[8px]'>General Settings</div>
        <div className='flex justify-between items-center py-[15px] border-b-[1px] border-[#eee]'>
          <div className='setting-info'>
            <h3 className='m-0 text-[1.1em] text-[#333]'>Enable Overdraft Protection</h3>
            <p className='m-[5px_0_0] text-[0.9em] text-[#666]'>Automatically transfer funds from your linked savings account to cover overdrafts.</p>
          </div>
          <label className='relative inline-block w-[45px] h-[25px]'>
            <input type='checkbox' className='opacity-0 w-0 h-0' checked={isEnabled} onChange={handleToggleOverdraftProtection} />
            <span className='slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] transition-all duration-400 rounded-[25px] before:absolute before:content-[""] before:h-[19px] before:w-[19px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all duration-400 before:rounded-full checked:bg-[#2196F3] checked:before:translate-x-[20px]'></span>
          </label>
        </div>

        <div className='text-[1.4em] text-[#0056b3] mt-[25px] mb-[15px] border-b-[2px] border-[#e0e0e0] pb-[8px]'>Linked Accounts</div>
        <div className='flex justify-between items-center py-[15px] border-b-[1px] border-[#eee]'>
          <div className='setting-info'>
            <h3 className='m-0 text-[1.1em] text-[#333]'>Primary Checking Account</h3>
            <p className='m-[5px_0_0] text-[0.9em] text-[#666]'>Checking Account (**** 1234)</p>
          </div>
        </div>
        <div className='flex justify-between items-center py-[15px] border-b-[1px] border-[#eee]'>
          <div className='setting-info'>
            <h3 className='m-0 text-[1.1em] text-[#333]'>Linked Savings Account</h3>
            <p className='m-[5px_0_0] text-[0.9em] text-[#666]'>Select the savings account to use for overdraft protection.</p>
          </div>
          <select
            className='select-dropdown p-[8px_12px] border-[1px] border-[#ccc] rounded-[4px] bg-white text-[0.9em] text-[#333] cursor-pointer appearance-none bg-[url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007bff%22%20d%3D%22M287%2C114.7L159.2%2C242.5c-5.8%2C5.8-15.2%2C5.8-21%2C0L5.4%2C114.7c-5.8-5.8-5.8-15.2%2C0-21l10.5-10.5c5.8-5.8%2C15.2-5.8%2C21%2C0l115.8%2C115.9l115.8-115.9c5.8-5.8%2C15.2-5.8%2C21%2C0l10.5%2C10.5C292.8%2C99.5%2C292.8%2C108.9%2C287%2C114.7z%22%2F%3E%3C%2Fsvg%3E")] bg-no-repeat bg-[right_8px_center] bg-[12px] pr-[30px]'
            value={linkedSavingsAccount}
            onChange={handleLinkSavingsAccount}
          >
            <option value='none'>Do Not Link</option>
            {availableSavingsAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.display}
              </option>
            ))}
          </select>
        </div>
        <div className='flex justify-between items-center py-[15px] border-b-[1px] border-[#eee]'>
          <div className='setting-info'>
            <h3 className='m-0 text-[1.1em] text-[#333]'>Unlink Account</h3>
            <p className='m-[5px_0_0] text-[0.9em] text-[#666]'>Remove the currently linked savings account.</p>
          </div>
          <button className='bg-[#007bff] text-white p-[10px_20px] border-none rounded-[5px] cursor-pointer text-[1em] transition-colors duration-300 hover:bg-[#0056b3]' onClick={handleUnlinkAccount}>Unlink</button>
        </div>

        <div className='text-[1.4em] text-[#0056b3] mt-[25px] mb-[15px] border-b-[2px] border-[#e0e0e0] pb-[8px]'>Notification Preferences</div>
        <div className='flex justify-between items-center py-[15px] border-b-[1px] border-[#eee]'>
          <div className='setting-info'>
            <h3 className='m-0 text-[1.1em] text-[#333]'>Email Notifications</h3>
            <p className='m-[5px_0_0] text-[0.9em] text-[#666]'>Receive email alerts for overdraft protection transfers.</p>
          </div>
          <label className='relative inline-block w-[45px] h-[25px]'>
            <input
              type='checkbox'
              className='opacity-0 w-0 h-0'
              checked={emailNotificationsEnabled}
              onChange={() => handleUpdateNotificationPreferences('email', !emailNotificationsEnabled)}
            />
            <span className='slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] transition-all duration-400 rounded-[25px] before:absolute before:content-[""] before:h-[19px] before:w-[19px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all duration-400 before:rounded-full checked:bg-[#2196F3] checked:before:translate-x-[20px]'></span>
          </label>
        </div>
        <div className='flex justify-between items-center py-[15px]'>
          <div className='setting-info'>
            <h3 className='m-0 text-[1.1em] text-[#333]'>SMS Notifications</h3>
            <p className='m-[5px_0_0] text-[0.9em] text-[#666]'>Receive text message alerts for overdraft protection transfers.</p>
          </div>
          <label className='relative inline-block w-[45px] h-[25px]'>
            <input
              type='checkbox'
              className='opacity-0 w-0 h-0'
              checked={smsNotificationsEnabled}
              onChange={() => handleUpdateNotificationPreferences('sms', !smsNotificationsEnabled)}
            />
            <span className='slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] transition-all duration-400 rounded-[25px] before:absolute before:content-[""] before:h-[19px] before:w-[19px] before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all duration-400 before:rounded-full checked:bg-[#2196F3] checked:before:translate-x-[20px]'></span>
          </label>
        </div>

        <div className='text-[1.4em] text-[#0056b3] mt-[25px] mb-[15px] border-b-[2px] border-[#e0e0e0] pb-[8px]'>Overdraft Transfer History</div>
        <table className='w-full border-collapse mt-[20px]'>
          <thead>
            <tr>
              <th className='border-[1px] border-[#ddd] p-[10px] text-left bg-[#f2f2f2] font-medium text-[#555]'>Date</th>
              <th className='border-[1px] border-[#ddd] p-[10px] text-left bg-[#f2f2f2] font-medium text-[#555]'>Amount</th>
              <th className='border-[1px] border-[#ddd] p-[10px] text-left bg-[#f2f2f2] font-medium text-[#555]'>From Account</th>
              <th className='border-[1px] border-[#ddd] p-[10px] text-left bg-[#f2f2f2] font-medium text-[#555]'>To Account</th>
              <th className='border-[1px] border-[#ddd] p-[10px] text-left bg-[#f2f2f2] font-medium text-[#555]'>Status</th>
            </tr>
          </thead>
          <tbody>
            {overdraftHistory.map((event) => (
              <tr key={event.id} className='even:bg-[#f9f9f9] hover:bg-[#f1f1f1]'>
                <td className='border-[1px] border-[#ddd] p-[10px] text-left'>{new Date(event.timestamp).toLocaleString()}</td>
                <td className='border-[1px] border-[#ddd] p-[10px] text-left'>${event.amount.toFixed(2)}</td>
                <td className='border-[1px] border-[#ddd] p-[10px] text-left'>Savings (**** {event.savings_account_id.slice(-4)})</td>
                <td className='border-[1px] border-[#ddd] p-[10px] text-left'>Checking (**** {event.checking_account_id.slice(-4)})</td>
                <td className={`border-[1px] border-[#ddd] p-[10px] text-left ${event.status === 'Success' ? 'text-[#28a745]' : 'text-[#dc3545]'} font-medium`}>
                  {event.status} {event.reason ? `(${event.reason})` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverdraftProtectionSettings;

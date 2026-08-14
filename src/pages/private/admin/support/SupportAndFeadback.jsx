import React, { useState, useEffect } from 'react';
import TransactionTable from './components/SupportTickets';
import InboxTable from './components/InboxTable';

export default function SupportAndFeedback() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('supportActiveTab') || 'ticket';
  });

  useEffect(() => {
    localStorage.setItem('supportActiveTab', activeTab);
  }, [activeTab]);

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-0 px-6 md:px-8 mt-6">
        <button
          onClick={() => setActiveTab('ticket')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'ticket'
              ? 'bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-[#7C3AED]/20 dark:text-[#A78BFA] border border-[#7C3AED] dark:border-[#A78BFA]'
              : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-700'
          }`}
        >
          Ticket
        </button>
        <button
          onClick={() => setActiveTab('live-chat')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'live-chat'
              ? 'bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-[#7C3AED]/20 dark:text-[#A78BFA] border border-[#7C3AED] dark:border-[#A78BFA]'
              : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-700'
          }`}
        >
          Live Chat
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'ticket' ? <TransactionTable /> : <InboxTable />}
    </div>
  );
}

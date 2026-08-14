import React from 'react';
import { MessageSquare, Ticket, Clock, Eye } from 'lucide-react';

const TicketList = ({ 
  tickets, 
  loading, 
  handleViewTicket, 
  setActiveTab,
  getStatusBadge,
  getPriorityColor,
  formatDate 
}) => {
  if (loading && tickets.length === 0) {
    return (
      <div className='p-4 sm:p-6 lg:p-8'>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7C3AED] border-r-transparent'></div>
            <p className='mt-4 text-sm text-gray-600 dark:text-gray-400'>Loading tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className='p-4 sm:p-6 lg:p-8'>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='rounded-full bg-gray-100 dark:bg-zinc-700 p-6 mb-4'>
            <Ticket className='text-gray-400 dark:text-gray-500' size={48} />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            No Tickets Yet
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md'>
            You haven't created any support tickets yet. Click on "Create Ticket" to submit your first request.
          </p>
          <button
            onClick={() => setActiveTab('create')}
            className='rounded-lg bg-[#7C3AED] px-6 py-3 text-base font-normal text-white transition-all duration-200 hover:bg-[#b388fc]'
          >
            Create Your First Ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='mb-6 flex items-center gap-3'>
        <div className='rounded-full bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 p-3'>
          <MessageSquare className='text-[#7C3AED]' size={24} />
        </div>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
            My Tickets
          </h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            View and track all your support requests
          </p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className='hidden lg:block overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200 dark:border-zinc-700'>
              <th className='text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400'>Ticket ID</th>
              <th className='text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400'>Subject</th>
              <th className='text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400'>Status</th>
              <th className='text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400'>Priority</th>
              <th className='text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400'>Messages</th>
              <th className='text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400'>Created</th>
              <th className='text-left py-4 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400'>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr 
                key={ticket.id} 
                className='border-b border-gray-100 dark:border-zinc-700/50 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition'
              >
                <td className='py-4 px-4'>
                  <span className='text-sm font-medium text-[#7C3AED] dark:text-[#b388fc]'>
                    {ticket.ticketId}
                  </span>
                </td>
                <td className='py-4 px-4'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]'>
                    {ticket.subject}
                  </p>
                </td>
                <td className='py-4 px-4'>
                  {getStatusBadge(ticket.status)}
                </td>
                <td className='py-4 px-4'>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className='py-4 px-4'>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {ticket._count?.messages || ticket.messages?.length || 0}
                  </span>
                </td>
                <td className='py-4 px-4'>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {formatDate(ticket.createdAt)}
                  </span>
                </td>
                <td className='py-4 px-4'>
                  <button
                    onClick={() => handleViewTicket(ticket.ticketId)}
                    className='flex items-center gap-1 text-sm font-medium text-[#7C3AED] hover:text-[#b388fc] transition'
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className='lg:hidden space-y-4'>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className='rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 p-4 transition hover:shadow-md'
          >
            <div className='flex items-start justify-between gap-3 mb-3'>
              <div>
                <span className='text-sm font-medium text-[#7C3AED] dark:text-[#b388fc]'>
                  {ticket.ticketId}
                </span>
                <h3 className='text-base font-semibold text-gray-900 dark:text-white mt-1'>
                  {ticket.subject}
                </h3>
              </div>
              <button
                onClick={() => handleViewTicket(ticket.ticketId)}
                className='flex items-center gap-1 text-sm font-medium text-[#7C3AED] hover:text-[#b388fc] transition shrink-0'
              >
                <Eye size={16} />
              </button>
            </div>
            
            <div className='flex flex-wrap items-center gap-2 mb-3'>
              {getStatusBadge(ticket.status)}
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            
            <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-zinc-700'>
              <div className='flex items-center gap-1'>
                <Clock size={12} />
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              <div className='flex items-center gap-1'>
                <MessageSquare size={12} />
                <span>{ticket._count?.messages || ticket.messages?.length || 0} messages</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;

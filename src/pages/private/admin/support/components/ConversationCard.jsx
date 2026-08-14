import React from 'react';
import { MessageSquare, Bot, User, Clock, AlertCircle } from 'lucide-react';

const ConversationCard = ({ conversation, onSelect, isSelected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'RESOLVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      billing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      account: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      features: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      general: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      troubleshooting: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[category] || colors.general;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      onClick={() => onSelect(conversation)}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-[#7C3AED] bg-[#7C3AED]/5 dark:bg-[#7C3AED]/10' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:border-[#7C3AED]/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
            {conversation.subject || 'No subject'}
          </p>
        </div>
        {conversation.escalated && (
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3" />
            Escalated
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(conversation.status)}`}>
          {conversation.status?.replace('_', ' ')}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(conversation.category)}`}>
          {conversation.category || 'general'}
        </span>
        {conversation.priority && (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            conversation.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            conversation.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            {conversation.priority}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          {conversation.user ? (
            <>
              <User className="w-3.5 h-3.5" />
              <span>{conversation.user.fullName || conversation.user.email}</span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5" />
              <span>Guest ({conversation.sessionId})</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(conversation.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <MessageSquare className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {conversation.messages?.length || 0} messages
        </span>
        {conversation.isAiHandled && (
          <span className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
            <Bot className="w-3.5 h-3.5" />
            AI handled
          </span>
        )}
      </div>
    </div>
  );
};

export default ConversationCard;

import React from 'react';
import { Edit2, Trash2, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

const ArticleCard = ({ article, onEdit, onDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      billing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      account: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      features: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      general: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      troubleshooting: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      dashboard: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getCategoryColor(article.category)}`}>
          {article.category}
        </span>
        <div className="flex items-center gap-1">
          {!article.isActive && (
            <span className="px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              Inactive
            </span>
          )}
        </div>
      </div>

      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {article.question}
      </h4>

      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
        {article.answer}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {article.keywords?.slice(0, 4).map((keyword, idx) => (
          <span 
            key={idx}
            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
          >
            {keyword}
          </span>
        ))}
        {article.keywords?.length > 4 && (
          <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
            +{article.keywords.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {article.viewCount || 0}
          </span>
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <ThumbsUp className="w-3.5 h-3.5" />
            {article.helpfulCount || 0}
          </span>
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <ThumbsDown className="w-3.5 h-3.5" />
            {article.notHelpfulCount || 0}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(article)}
            className="p-2 text-gray-500 hover:text-[#7C3AED] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(article.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MessageSquare,
  Bot,
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  BookOpen,
  RefreshCw,
  ThumbsUp,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  getAdminConversations,
  adminRespondToConversation,
  getAdminSupportAnalytics,
  getKnowledgeArticles,
  createKnowledgeArticle,
  updateKnowledgeArticle,
  deleteKnowledgeArticle,
} from '../../../../features/adminAiSupport/adminAiSupportAPI';
import {
  setActiveTab,
  setConversationFilter,
  setSelectedConversation,
  clearSelectedConversation,
  clearMessages,
  selectAdminAiSupport,
} from '../../../../features/adminAiSupport/adminAiSupportSlice';

// Import extracted components
import {
  AnalyticsCard,
  ConversationCard,
  ConversationDetail,
  ArticleCard,
  ArticleModal,
  DeleteConfirmModal,
} from './components';

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminAiSupportDashboard() {
  const dispatch = useDispatch();
  const {
    conversations,
    selectedConversation,
    conversationsLoading,
    respondLoading,
    analytics,
    analyticsLoading,
    knowledgeArticles,
    knowledgeLoading,
    knowledgeActionLoading,
    activeTab,
    conversationFilter,
    error,
    success,
  } = useSelector(selectAdminAiSupport);

  const [searchTerm, setSearchTerm] = useState('');
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load data on mount
  useEffect(() => {
    dispatch(getAdminSupportAnalytics({})); // No date filter to get all-time stats
    dispatch(getAdminConversations({ page: 1, limit: 20 }));
    dispatch(getKnowledgeArticles());
  }, [dispatch]);

  // Clear messages after delay
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations;
    
    // Apply filter
    if (conversationFilter === 'escalated') {
      filtered = filtered.filter(c => c.escalated);
    } else if (conversationFilter === 'open') {
      filtered = filtered.filter(c => c.status === 'OPEN');
    } else if (conversationFilter === 'resolved') {
      filtered = filtered.filter(c => c.resolved);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.subject?.toLowerCase().includes(term) ||
        c.user?.fullName?.toLowerCase().includes(term) ||
        c.user?.email?.toLowerCase().includes(term) ||
        c.sessionId?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [conversations, conversationFilter, searchTerm]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    if (!searchTerm) return knowledgeArticles;
    const term = searchTerm.toLowerCase();
    return knowledgeArticles.filter(a =>
      a.question?.toLowerCase().includes(term) ||
      a.answer?.toLowerCase().includes(term) ||
      a.category?.toLowerCase().includes(term) ||
      a.keywords?.some(k => k.toLowerCase().includes(term))
    );
  }, [knowledgeArticles, searchTerm]);

  // Handlers
  const handleFilterChange = (filter) => {
    dispatch(setConversationFilter(filter));
    const params = { page: 1, limit: 20 };
    if (filter === 'escalated') params.escalated = true;
    else if (filter === 'open') params.status = 'OPEN';
    dispatch(getAdminConversations(params));
  };

  const handleRespond = async (conversationId, message) => {
    try {
      await dispatch(adminRespondToConversation({ conversationId, message })).unwrap();
      dispatch(getAdminConversations({ page: 1, limit: 20 }));
    } catch (err) {
      console.error('Failed to respond:', err);
    }
  };

  const handleSaveArticle = async (articleData) => {
    try {
      if (articleData.articleId) {
        await dispatch(updateKnowledgeArticle(articleData)).unwrap();
      } else {
        await dispatch(createKnowledgeArticle(articleData)).unwrap();
      }
      setShowArticleModal(false);
      setEditingArticle(null);
    } catch (err) {
      console.error('Failed to save article:', err);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await dispatch(deleteKnowledgeArticle(articleId)).unwrap();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete article:', err);
    }
  };

  const handleRefreshAnalytics = () => {
    dispatch(getAdminSupportAnalytics({}));
    dispatch(getAdminConversations({ page: 1, limit: 20 }));
    dispatch(getKnowledgeArticles());
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#7C3AED]" />
          AI Support Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage AI conversations, analytics, and knowledge base
        </p>
      </div>

      {/* Success/Error Messages */}
      {(success || error) && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          success 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
        }`}>
          {success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{success || error}</span>
        </div>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <AnalyticsCard
          title="Total Conversations"
          value={analytics.totalConversations}
          icon={MessageSquare}
          color="bg-[#7C3AED]"
          loading={analyticsLoading}
        />
        <AnalyticsCard
          title="AI Handled"
          value={analytics.aiHandledConversations}
          icon={Bot}
          color="bg-blue-500"
          loading={analyticsLoading}
        />
        <AnalyticsCard
          title="Escalated"
          value={analytics.escalatedConversations}
          icon={AlertCircle}
          color="bg-red-500"
          subtext={`${analytics.escalationRate}% rate`}
          loading={analyticsLoading}
        />
        <AnalyticsCard
          title="Resolved"
          value={analytics.resolvedConversations}
          icon={CheckCircle}
          color="bg-green-500"
          subtext={`${analytics.resolutionRate}% rate`}
          loading={analyticsLoading}
        />
        <AnalyticsCard
          title="Satisfaction"
          value={analytics.averageSatisfactionScore ? `${analytics.averageSatisfactionScore}/5` : 'N/A'}
          icon={ThumbsUp}
          color="bg-yellow-500"
          loading={analyticsLoading}
        />
        <AnalyticsCard
          title="Articles"
          value={knowledgeArticles.length}
          icon={BookOpen}
          color="bg-indigo-500"
          loading={knowledgeLoading}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'conversations', label: 'Conversations', icon: MessageSquare },
          { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setActiveTab(tab.id))}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-[#7C3AED]/20 dark:text-purple-300 border border-[#7C3AED]'
                : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}

        {/* Refresh Analytics */}
        <button
          onClick={handleRefreshAnalytics}
          disabled={analyticsLoading}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Conversations Tab */}
      {activeTab === 'conversations' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Conversations List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                />
              </div>
              <select
                value={conversationFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full sm:w-32 shrink-0 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="escalated">Escalated</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Conversations List */}
            <div className="space-y-3 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
              {conversationsLoading && conversations.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <ConversationCard
                    key={conv.id}
                    conversation={conv}
                    onSelect={(c) => dispatch(setSelectedConversation(c))}
                    isSelected={selectedConversation?.id === conv.id}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right - Conversation Detail */}
          <div className="lg:col-span-3 h-[calc(100vh-100px)] min-h-[600px]">
            {selectedConversation ? (
              <ConversationDetail
                conversation={selectedConversation}
                onClose={() => dispatch(clearSelectedConversation())}
                onRespond={handleRespond}
                respondLoading={respondLoading}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Select a conversation</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Click on a conversation to view details and respond
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                setEditingArticle(null);
                setShowArticleModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Article
            </button>
          </div>

          {/* Articles Grid */}
          {knowledgeLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No articles found</p>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setShowArticleModal(true);
                }}
                className="mt-4 text-[#7C3AED] hover:underline font-medium"
              >
                Create your first article
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onEdit={(a) => {
                    setEditingArticle(a);
                    setShowArticleModal(true);
                  }}
                  onDelete={(id) => setDeleteConfirm(id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Article Modal */}
      {showArticleModal && (
        <ArticleModal
          article={editingArticle}
          onClose={() => {
            setShowArticleModal(false);
            setEditingArticle(null);
          }}
          onSave={handleSaveArticle}
          loading={knowledgeActionLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          title="Delete Article?"
          message="This action cannot be undone. The article will be permanently removed from the knowledge base."
          onConfirm={() => handleDeleteArticle(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
          loading={knowledgeActionLoading}
        />
      )}
    </div>
  );
}

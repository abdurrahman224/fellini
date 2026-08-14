import { createSlice } from '@reduxjs/toolkit';
import {
  getAdminConversations,
  adminRespondToConversation,
  getAdminSupportAnalytics,
  getKnowledgeArticles,
  createKnowledgeArticle,
  updateKnowledgeArticle,
  deleteKnowledgeArticle,
} from './adminAiSupportAPI';

const initialState = {
  // Conversations
  conversations: [],
  conversationsPagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  },
  selectedConversation: null,
  conversationsLoading: false,
  respondLoading: false,

  // Analytics
  analytics: {
    totalConversations: 0,
    aiHandledConversations: 0,
    escalatedConversations: 0,
    resolvedConversations: 0,
    escalationRate: '0.00',
    resolutionRate: '0.00',
    averageSatisfactionScore: null,
  },
  analyticsLoading: false,

  // Knowledge Base
  knowledgeArticles: [],
  knowledgeLoading: false,
  knowledgeActionLoading: false,

  // UI State
  activeTab: 'conversations', // 'conversations', 'knowledge', 'analytics'
  conversationFilter: 'all', // 'all', 'escalated', 'open', 'resolved'

  // Messages
  error: null,
  success: null,
};

const adminAiSupportSlice = createSlice({
  name: 'adminAiSupport',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setConversationFilter: (state, action) => {
      state.conversationFilter = action.payload;
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    clearSelectedConversation: (state) => {
      state.selectedConversation = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================================
      // CONVERSATIONS
      // ============================================
      .addCase(getAdminConversations.pending, (state) => {
        state.conversationsLoading = true;
        state.error = null;
      })
      .addCase(getAdminConversations.fulfilled, (state, action) => {
        state.conversationsLoading = false;
        state.conversations = action.payload.conversations;
        state.conversationsPagination = action.payload.pagination;
      })
      .addCase(getAdminConversations.rejected, (state, action) => {
        state.conversationsLoading = false;
        state.error = action.payload;
      })

      // Admin respond to conversation
      .addCase(adminRespondToConversation.pending, (state) => {
        state.respondLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(adminRespondToConversation.fulfilled, (state, action) => {
        state.respondLoading = false;
        state.success = 'Response sent successfully';
        
        // Update conversation in list
        const index = state.conversations.findIndex(
          c => c.id === action.payload.conversationId
        );
        if (index !== -1) {
          state.conversations[index].status = 'IN_PROGRESS';
        }
        
        // Clear selected conversation to refresh
        state.selectedConversation = null;
      })
      .addCase(adminRespondToConversation.rejected, (state, action) => {
        state.respondLoading = false;
        state.error = action.payload;
      })

      // ============================================
      // ANALYTICS
      // ============================================
      .addCase(getAdminSupportAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(getAdminSupportAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(getAdminSupportAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
      })

      // ============================================
      // KNOWLEDGE BASE
      // ============================================
      .addCase(getKnowledgeArticles.pending, (state) => {
        state.knowledgeLoading = true;
        state.error = null;
      })
      .addCase(getKnowledgeArticles.fulfilled, (state, action) => {
        state.knowledgeLoading = false;
        state.knowledgeArticles = action.payload;
      })
      .addCase(getKnowledgeArticles.rejected, (state, action) => {
        state.knowledgeLoading = false;
        state.error = action.payload;
      })

      // Create article
      .addCase(createKnowledgeArticle.pending, (state) => {
        state.knowledgeActionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createKnowledgeArticle.fulfilled, (state, action) => {
        state.knowledgeActionLoading = false;
        state.success = 'Article created successfully';
        state.knowledgeArticles.unshift(action.payload);
      })
      .addCase(createKnowledgeArticle.rejected, (state, action) => {
        state.knowledgeActionLoading = false;
        state.error = action.payload;
      })

      // Update article
      .addCase(updateKnowledgeArticle.pending, (state) => {
        state.knowledgeActionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateKnowledgeArticle.fulfilled, (state, action) => {
        state.knowledgeActionLoading = false;
        state.success = 'Article updated successfully';
        
        const index = state.knowledgeArticles.findIndex(
          a => a.id === action.payload.articleId
        );
        if (index !== -1) {
          state.knowledgeArticles[index] = {
            ...state.knowledgeArticles[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(updateKnowledgeArticle.rejected, (state, action) => {
        state.knowledgeActionLoading = false;
        state.error = action.payload;
      })

      // Delete article
      .addCase(deleteKnowledgeArticle.pending, (state) => {
        state.knowledgeActionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteKnowledgeArticle.fulfilled, (state, action) => {
        state.knowledgeActionLoading = false;
        state.success = 'Article deleted successfully';
        state.knowledgeArticles = state.knowledgeArticles.filter(
          a => a.id !== action.payload
        );
      })
      .addCase(deleteKnowledgeArticle.rejected, (state, action) => {
        state.knowledgeActionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveTab,
  setConversationFilter,
  setSelectedConversation,
  clearSelectedConversation,
  clearMessages,
} = adminAiSupportSlice.actions;

// Selectors
export const selectAdminAiSupport = (state) => state.adminAiSupport;
export const selectConversations = (state) => state.adminAiSupport.conversations;
export const selectAnalytics = (state) => state.adminAiSupport.analytics;
export const selectKnowledgeArticles = (state) => state.adminAiSupport.knowledgeArticles;

export default adminAiSupportSlice.reducer;

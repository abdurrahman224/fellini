import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, POST, PUT, DELETE } from '../../services/httpMethods';

// ============================================
// CONVERSATIONS API
// ============================================

/**
 * Get all AI support conversations for admin
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {boolean} escalated - Filter by escalated status
 * @param {string} status - Filter by status (OPEN, IN_PROGRESS, RESOLVED)
 */
export const getAdminConversations = createAsyncThunk(
  'adminAiSupport/getConversations',
  async ({ page = 1, limit = 20, escalated, status } = {}, { rejectWithValue }) => {
    try {
      let url = `/api/v1/admin/support/conversations?page=${page}&limit=${limit}`;
      if (escalated !== undefined) url += `&escalated=${escalated}`;
      if (status) url += `&status=${status}`;
      
      const response = await GET(url);
      if (response?.success) {
        return {
          conversations: response.data.conversations,
          pagination: response.data.pagination,
        };
      }
      return rejectWithValue(response?.message || 'Failed to fetch conversations');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

/**
 * Admin respond to a conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} message - Response message
 */
export const adminRespondToConversation = createAsyncThunk(
  'adminAiSupport/respondToConversation',
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      const response = await POST(
        `/api/v1/admin/support/conversations/${conversationId}/respond`,
        { message }
      );
      if (response?.success) {
        return {
          conversationId,
          message: response.message,
        };
      }
      return rejectWithValue(response?.message || 'Failed to send response');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

// ============================================
// ANALYTICS API
// ============================================

/**
 * Get AI support analytics
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 */
export const getAdminSupportAnalytics = createAsyncThunk(
  'adminAiSupport/getAnalytics',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      let url = '/api/v1/admin/support/analytics';
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      
      const response = await GET(url);
      if (response?.success) {
        return response.data;
      }
      return rejectWithValue(response?.message || 'Failed to fetch analytics');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

// ============================================
// KNOWLEDGE BASE API
// ============================================

/**
 * Get all knowledge base articles
 */
export const getKnowledgeArticles = createAsyncThunk(
  'adminAiSupport/getKnowledgeArticles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/admin/support/knowledge');
      if (response?.success) {
        return response.data;
      }
      return rejectWithValue(response?.message || 'Failed to fetch knowledge articles');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

/**
 * Create a new knowledge base article
 * @param {Object} articleData - Article data
 */
export const createKnowledgeArticle = createAsyncThunk(
  'adminAiSupport/createKnowledgeArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/admin/support/knowledge', articleData);
      if (response?.success) {
        return response.data;
      }
      return rejectWithValue(response?.message || 'Failed to create article');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

/**
 * Update a knowledge base article
 * @param {string} articleId - Article ID
 * @param {Object} articleData - Updated article data
 */
export const updateKnowledgeArticle = createAsyncThunk(
  'adminAiSupport/updateKnowledgeArticle',
  async ({ articleId, ...articleData }, { rejectWithValue }) => {
    try {
      const response = await PUT(`/api/v1/admin/support/knowledge/${articleId}`, articleData);
      if (response?.success) {
        return { articleId, data: response.data };
      }
      return rejectWithValue(response?.message || 'Failed to update article');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

/**
 * Delete a knowledge base article
 * @param {string} articleId - Article ID
 */
export const deleteKnowledgeArticle = createAsyncThunk(
  'adminAiSupport/deleteKnowledgeArticle',
  async (articleId, { rejectWithValue }) => {
    try {
      const response = await DELETE(`/api/v1/admin/support/knowledge/${articleId}`);
      if (response?.success) {
        return articleId;
      }
      return rejectWithValue(response?.message || 'Failed to delete article');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, POST } from '../../services/httpMethods';

// ==========================================
// CHAT ENDPOINTS (Guest + Authenticated)
// ==========================================

// Start a new support conversation
export const startSupportChat = createAsyncThunk(
  'aiSupport/startChat',
  async ({ message, sessionId }, { rejectWithValue }) => {
    try {
      const payload = { message };
      if (sessionId) {
        payload.sessionId = sessionId;
      }
      
      const response = await POST('/api/v1/support/chat/start', payload);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to start conversation');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to start conversation'
      );
    }
  }
);

// Continue an existing conversation
export const continueSupportChat = createAsyncThunk(
  'aiSupport/continueChat',
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/support/chat/continue', {
        conversationId,
        message
      });
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to send message');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to send message'
      );
    }
  }
);

// Escalate conversation to human support
export const escalateToHuman = createAsyncThunk(
  'aiSupport/escalate',
  async ({ conversationId, reason }, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/support/chat/escalate', {
        conversationId,
        reason
      });
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to escalate');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to escalate'
      );
    }
  }
);

// ==========================================
// KNOWLEDGE BASE ENDPOINTS (Public)
// ==========================================

// Search knowledge base articles
export const searchKnowledgeBase = createAsyncThunk(
  'aiSupport/searchKB',
  async ({ query, category }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      
      const response = await GET(`/api/v1/support/knowledge/search?${params.toString()}`);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to search knowledge base');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to search knowledge base'
      );
    }
  }
);

// Get quick help suggestions (top FAQ)
export const getQuickHelp = createAsyncThunk(
  'aiSupport/quickHelp',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/support/knowledge/quick-help');
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get quick help');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get quick help'
      );
    }
  }
);

// Get knowledge article by ID
export const getKnowledgeArticle = createAsyncThunk(
  'aiSupport/getArticle',
  async (articleId, { rejectWithValue }) => {
    try {
      const response = await GET(`/api/v1/support/knowledge/article/${articleId}`);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get article');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get article'
      );
    }
  }
);

// Rate knowledge article as helpful or not
export const rateKnowledgeArticle = createAsyncThunk(
  'aiSupport/rateArticle',
  async ({ articleId, helpful }, { rejectWithValue }) => {
    try {
      const response = await POST(`/api/v1/support/knowledge/article/${articleId}/rate`, {
        helpful
      });
      
      if (response.success) {
        return { articleId, helpful, message: response.message };
      } else {
        return rejectWithValue(response.message || 'Failed to rate article');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to rate article'
      );
    }
  }
);

// ==========================================
// USER CONVERSATION HISTORY (Authenticated)
// ==========================================

// Get user's support conversations
export const getUserConversations = createAsyncThunk(
  'aiSupport/getUserConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/support/conversations');
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get conversations');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get conversations'
      );
    }
  }
);

// Get specific conversation history
export const getConversationHistory = createAsyncThunk(
  'aiSupport/getConversationHistory',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await GET(`/api/v1/support/conversations/${conversationId}`);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get conversation');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get conversation'
      );
    }
  }
);

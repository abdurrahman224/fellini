import { createSlice } from '@reduxjs/toolkit';
import {
  startSupportChat,
  continueSupportChat,
  escalateToHuman,
  searchKnowledgeBase,
  getQuickHelp,
  getKnowledgeArticle,
  rateKnowledgeArticle,
  getUserConversations,
  getConversationHistory
} from './aiSupportAPI';

// Generate guest session ID
const generateSessionId = () => {
  return `guest-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// Get or create session ID from localStorage
const getGuestSessionId = () => {
  let sessionId = localStorage.getItem('aiSupportSessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('aiSupportSessionId', sessionId);
  }
  return sessionId;
};

const initialState = {
  // Chat state
  conversationId: null,
  sessionId: getGuestSessionId(),
  messages: [],
  isEscalated: false,
  shouldEscalate: false,
  
  // UI state
  isOpen: false,
  activeView: 'chat', // 'chat', 'quickHelp', 'article', 'history'
  
  // Loading states
  chatLoading: false,
  quickHelpLoading: false,
  articleLoading: false,
  historyLoading: false,
  searchLoading: false,
  
  // Knowledge base
  quickHelpArticles: [],
  searchResults: [],
  selectedArticle: null,
  
  // Conversation history (authenticated users)
  conversationHistory: [],
  selectedConversation: null,
  
  // Error state
  error: null,
  
  // Feedback
  ratingSuccess: null,
};

const aiSupportSlice = createSlice({
  name: 'aiSupport',
  initialState,
  reducers: {
    // Toggle widget open/close
    toggleWidget: (state) => {
      state.isOpen = !state.isOpen;
    },
    openWidget: (state) => {
      state.isOpen = true;
    },
    closeWidget: (state) => {
      state.isOpen = false;
    },
    
    // Change view
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    
    // Add user message to UI immediately
    addUserMessage: (state, action) => {
      state.messages.push({
        id: `temp-${Date.now()}`,
        role: 'user',
        message: action.payload,
        isFromUser: true,
        isFromAi: false,
        createdAt: new Date().toISOString()
      });
    },
    
    // Clear conversation (start fresh)
    clearConversation: (state) => {
      state.conversationId = null;
      state.messages = [];
      state.isEscalated = false;
      state.shouldEscalate = false;
      state.error = null;
      state.activeView = 'chat';
    },
    
    // Clear selected article
    clearSelectedArticle: (state) => {
      state.selectedArticle = null;
      state.activeView = 'quickHelp';
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear rating success
    clearRatingSuccess: (state) => {
      state.ratingSuccess = null;
    },
    
    // Reset session (for testing)
    resetSession: (state) => {
      const newSessionId = generateSessionId();
      localStorage.setItem('aiSupportSessionId', newSessionId);
      state.sessionId = newSessionId;
      state.conversationId = null;
      state.messages = [];
      state.isEscalated = false;
    },

    // Load existing conversation
    loadConversation: (state, action) => {
      const conversation = action.payload;
      state.conversationId = conversation.id;
      state.messages = conversation.messages || [];
      state.isEscalated = conversation.escalated || false;
      state.activeView = 'chat';
    }
  },
  extraReducers: (builder) => {
    builder
      // ==========================================
      // START SUPPORT CHAT
      // ==========================================
      .addCase(startSupportChat.pending, (state) => {
        state.chatLoading = true;
        state.error = null;
      })
      .addCase(startSupportChat.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.conversationId = action.payload.conversationId;
        if (action.payload.sessionId) {
          state.sessionId = action.payload.sessionId;
          localStorage.setItem('aiSupportSessionId', action.payload.sessionId);
        }
        state.messages.push({
          id: `ai-${Date.now()}`,
          role: 'assistant',
          message: action.payload.message,
          isFromUser: false,
          isFromAi: true,
          createdAt: new Date().toISOString()
        });
        state.shouldEscalate = action.payload.shouldEscalate || false;
      })
      .addCase(startSupportChat.rejected, (state, action) => {
        state.chatLoading = false;
        state.error = action.payload;
        // Remove the pending user message on error
        state.messages = state.messages.filter(m => !m.id.startsWith('temp-'));
      })
      
      // ==========================================
      // CONTINUE SUPPORT CHAT
      // ==========================================
      .addCase(continueSupportChat.pending, (state) => {
        state.chatLoading = true;
        state.error = null;
      })
      .addCase(continueSupportChat.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.messages.push({
          id: `ai-${Date.now()}`,
          role: 'assistant',
          message: action.payload.message,
          isFromUser: false,
          isFromAi: true,
          createdAt: new Date().toISOString()
        });
        state.shouldEscalate = action.payload.shouldEscalate || false;
      })
      .addCase(continueSupportChat.rejected, (state, action) => {
        state.chatLoading = false;
        state.error = action.payload;
      })
      
      // ==========================================
      // ESCALATE TO HUMAN
      // ==========================================
      .addCase(escalateToHuman.pending, (state) => {
        state.chatLoading = true;
      })
      .addCase(escalateToHuman.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.isEscalated = true;
        state.messages.push({
          id: `system-${Date.now()}`,
          role: 'system',
          message: action.payload.message || 'Your conversation has been escalated to our human support team. Someone will get back to you shortly.',
          isFromUser: false,
          isFromAi: false,
          createdAt: new Date().toISOString()
        });
      })
      .addCase(escalateToHuman.rejected, (state, action) => {
        state.chatLoading = false;
        state.error = action.payload;
      })
      
      // ==========================================
      // GET QUICK HELP
      // ==========================================
      .addCase(getQuickHelp.pending, (state) => {
        state.quickHelpLoading = true;
      })
      .addCase(getQuickHelp.fulfilled, (state, action) => {
        state.quickHelpLoading = false;
        state.quickHelpArticles = action.payload;
      })
      .addCase(getQuickHelp.rejected, (state, action) => {
        state.quickHelpLoading = false;
        state.error = action.payload;
      })
      
      // ==========================================
      // SEARCH KNOWLEDGE BASE
      // ==========================================
      .addCase(searchKnowledgeBase.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchKnowledgeBase.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchKnowledgeBase.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })
      
      // ==========================================
      // GET KNOWLEDGE ARTICLE
      // ==========================================
      .addCase(getKnowledgeArticle.pending, (state) => {
        state.articleLoading = true;
      })
      .addCase(getKnowledgeArticle.fulfilled, (state, action) => {
        state.articleLoading = false;
        state.selectedArticle = action.payload;
        state.activeView = 'article';
      })
      .addCase(getKnowledgeArticle.rejected, (state, action) => {
        state.articleLoading = false;
        state.error = action.payload;
      })
      
      // ==========================================
      // RATE ARTICLE
      // ==========================================
      .addCase(rateKnowledgeArticle.fulfilled, (state, action) => {
        state.ratingSuccess = action.payload.message;
      })
      .addCase(rateKnowledgeArticle.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // ==========================================
      // GET USER CONVERSATIONS
      // ==========================================
      .addCase(getUserConversations.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(getUserConversations.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.conversationHistory = action.payload;
      })
      .addCase(getUserConversations.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      })
      
      // ==========================================
      // GET CONVERSATION HISTORY
      // ==========================================
      .addCase(getConversationHistory.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(getConversationHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.selectedConversation = action.payload;
        // Load messages into current chat
        state.conversationId = action.payload.id;
        state.messages = action.payload.messages || [];
        state.isEscalated = action.payload.escalated || false;
        state.activeView = 'chat';
      })
      .addCase(getConversationHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  toggleWidget,
  openWidget,
  closeWidget,
  setActiveView,
  addUserMessage,
  clearConversation,
  clearSelectedArticle,
  clearError,
  clearRatingSuccess,
  resetSession,
  loadConversation
} = aiSupportSlice.actions;

// Selectors
export const selectAiSupport = (state) => state.aiSupport;
export const selectIsWidgetOpen = (state) => state.aiSupport.isOpen;
export const selectMessages = (state) => state.aiSupport.messages;
export const selectIsEscalated = (state) => state.aiSupport.isEscalated;
export const selectActiveView = (state) => state.aiSupport.activeView;
export const selectQuickHelpArticles = (state) => state.aiSupport.quickHelpArticles;
export const selectSelectedArticle = (state) => state.aiSupport.selectedArticle;

export default aiSupportSlice.reducer;

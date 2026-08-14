import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

// Initial state
const initialState = {
  sessionStarted: false,
  sessionId: null,
  sessionData: null,
  roomId: null,
  chatRooms: [],
  adminChatRooms: [],
  messages: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunk to start chat session
export const startChatSession = createAsyncThunk(
  'chat/startSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/v1/chat/start');
      
      // Return the data object from the API response
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to start chat session');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start chat session');
    }
  }
);

// Async thunk to fetch chat rooms
export const fetchChatRooms = createAsyncThunk(
  'chat/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/chat/my-rooms');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch chat rooms');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat rooms');
    }
  }
);

// Async thunk to fetch all admin chat rooms with pagination
export const fetchAdminChatRooms = createAsyncThunk(
  'chat/fetchAdminRooms',
  async ({ page = 1, limit = 20, status = 'ACTIVE' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/chat/rooms/all?page=${page}&limit=${limit}&status=${status}`
      );
      
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch admin chat rooms');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin chat rooms');
    }
  }
);

// Async thunk to fetch messages for a specific room
export const fetchChatMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/chat/${roomId}/messages`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch messages');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// Async thunk to send a message
export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ roomId, message }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/v1/chat/${roomId}/message`, {
        message,
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// Chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    resetChatSession: (state) => {
      state.sessionStarted = false;
      state.sessionId = null;
      state.sessionData = null;
      state.roomId = null;
      state.chatRooms = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start chat session
      .addCase(startChatSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startChatSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionStarted = true;
        state.sessionId = action.payload?.id || null;
        state.sessionData = action.payload;
        state.error = null;
      })
      .addCase(startChatSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch chat rooms
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.chatRooms = action.payload;
        
        // Get the most recent room ID (first in the array)
        if (action.payload && action.payload.length > 0) {
          state.roomId = action.payload[0].id;
        }
        
        state.error = null;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch chat messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        
        // Transform API messages to component format
        state.messages = action.payload.map((msg) => ({
          id: msg.id,
          from: msg.isFromAdmin ? 'bot' : 'user',
          text: msg.message,
          senderId: msg.senderId,
          isRead: msg.isRead,
          createdAt: msg.createdAt,
        }));
        
        state.error = null;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send chat message
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        
        // Add the new message to messages array
        const newMessage = {
          id: action.payload.id,
          from: action.payload.isFromAdmin ? 'bot' : 'user',
          text: action.payload.message,
          senderId: action.payload.senderId,
          isRead: action.payload.isRead,
          createdAt: action.payload.createdAt,
        };
        
        state.messages.push(newMessage);
        state.error = null;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch admin chat rooms
      .addCase(fetchAdminChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.adminChatRooms = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAdminChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, clearMessages, resetChatSession } = chatSlice.actions;
export default chatSlice.reducer;

import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, POST } from '../../services/httpMethods';

// Create a new support ticket
export const createTicket = createAsyncThunk(
  'support/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/tickets', ticketData);

      if (response.success) {
        return response.ticket;
      } else {
        return rejectWithValue(response.message || 'Failed to create ticket');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create ticket'
      );
    }
  }
);

// Get all user tickets
export const getUserTickets = createAsyncThunk(
  'support/getUserTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/tickets');

      if (response.success) {
        return {
          tickets: response.tickets || [],
          pagination: response.pagination || null,
        };
      } else {
        return rejectWithValue(response.message || 'Failed to fetch tickets');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch tickets'
      );
    }
  }
);

// Get individual ticket by ID
export const getTicketById = createAsyncThunk(
  'support/getTicketById',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await GET(`/api/v1/tickets/${ticketId}`);

      if (response.success) {
        return response.ticket;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch ticket');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch ticket'
      );
    }
  }
);

// Reply to a ticket
export const replyToTicket = createAsyncThunk(
  'support/replyToTicket',
  async ({ ticketId, message }, { rejectWithValue }) => {
    try {
      const response = await POST(`/api/v1/tickets/${ticketId}/reply`, { message });

      if (response.success) {
        return {
          ticketMessage: response.ticketMessage,
          ticket: response.ticket,
        };
      } else {
        return rejectWithValue(response.message || 'Failed to send reply');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to send reply'
      );
    }
  }
);

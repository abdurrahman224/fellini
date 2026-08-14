import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, POST, PUT, PATCH } from '../../services/httpMethods';

// Get all support tickets (admin view)
export const getAdminTickets = createAsyncThunk(
  'adminSupport/getAdminTickets',
  async ({ page = 1, limit = 9000 } = {}, { rejectWithValue }) => {
    try {
      const response = await GET(`/api/v1/admin/tickets?page=${page}&limit=${limit}`);
      if (response?.success) {
        return {
          tickets: response.tickets,
          pagination: response.pagination,
          statistics: response.statistics,
        };
      }
      return rejectWithValue(response?.message || 'Failed to fetch tickets');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

// Get single ticket details
export const getAdminTicketById = createAsyncThunk(
  'adminSupport/getAdminTicketById',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await GET(`/api/v1/admin/tickets/${ticketId}`);
      if (response?.success) {
        return response.ticket;
      }
      return rejectWithValue(response?.message || 'Failed to fetch ticket details');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

// Reply to ticket (admin)
export const adminReplyToTicket = createAsyncThunk(
  'adminSupport/adminReplyToTicket',
  async ({ ticketId, message }, { rejectWithValue }) => {
    try {
      const response = await POST(`/api/v1/admin/tickets/${ticketId}/reply`, { message });
      if (response?.success) {
        return {
          ticketId,
          message: response.message,
        };
      }
      return rejectWithValue(response?.message || 'Failed to send reply');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

// Update ticket status
export const updateTicketStatus = createAsyncThunk(
  'adminSupport/updateTicketStatus',
  async ({ ticketId, status }, { rejectWithValue }) => {
    try {
      const response = await PATCH(`/api/v1/admin/tickets/${ticketId}/status`, { status });
      if (response?.success) {
        return {
          ticketId,
          ticket: response.ticket,
        };
      }
      return rejectWithValue(response?.message || 'Failed to update status');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

// Assign ticket to admin
export const assignTicket = createAsyncThunk(
  'adminSupport/assignTicket',
  async ({ ticketId, adminId }, { rejectWithValue }) => {
    try {
      const response = await PUT(`/api/v1/admin/tickets/${ticketId}/assign`, { adminId });
      if (response?.success) {
        return {
          ticketId,
          ticket: response.ticket,
        };
      }
      return rejectWithValue(response?.message || 'Failed to assign ticket');
    } catch (error) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

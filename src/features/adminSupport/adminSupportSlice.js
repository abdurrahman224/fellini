import { createSlice } from '@reduxjs/toolkit';
import {
  getAdminTickets,
  getAdminTicketById,
  adminReplyToTicket,
  updateTicketStatus,
  assignTicket,
} from './adminSupportAPI';

const initialState = {
  tickets: [],
  selectedTicket: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 9000,
    totalPages: 1,
  },
  statistics: {
    open: 0,
    in_progress: 0,
  },
  loading: false,
  detailLoading: false,
  replyLoading: false,
  statusLoading: false,
  error: null,
  success: null,
};

const adminSupportSlice = createSlice({
  name: 'adminSupport',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all tickets
      .addCase(getAdminTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
        state.pagination = action.payload.pagination;
        state.statistics = action.payload.statistics;
      })
      .addCase(getAdminTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get ticket by ID
      .addCase(getAdminTicketById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(getAdminTicketById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(getAdminTicketById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      // Admin reply to ticket
      .addCase(adminReplyToTicket.pending, (state) => {
        state.replyLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(adminReplyToTicket.fulfilled, (state, action) => {
        state.replyLoading = false;
        state.success = 'Reply sent successfully';
        
        // Update the selected ticket's messages
        if (state.selectedTicket && state.selectedTicket.ticketId === action.payload.ticketId) {
          state.selectedTicket.messages.push(action.payload.message);
        }
      })
      .addCase(adminReplyToTicket.rejected, (state, action) => {
        state.replyLoading = false;
        state.error = action.payload;
      })

      // Update ticket status
      .addCase(updateTicketStatus.pending, (state) => {
        state.statusLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.success = 'Status updated successfully';
        
        // Update ticket in list
        const index = state.tickets.findIndex(t => t.ticketId === action.payload.ticketId);
        if (index !== -1) {
          state.tickets[index] = action.payload.ticket;
        }
        
        // Update selected ticket
        if (state.selectedTicket && state.selectedTicket.ticketId === action.payload.ticketId) {
          state.selectedTicket = action.payload.ticket;
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.statusLoading = false;
        state.error = action.payload;
      })

      // Assign ticket
      .addCase(assignTicket.pending, (state) => {
        state.statusLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.success = 'Ticket assigned successfully';
        
        // Update ticket in list
        const index = state.tickets.findIndex(t => t.ticketId === action.payload.ticketId);
        if (index !== -1) {
          state.tickets[index] = action.payload.ticket;
        }
        
        // Update selected ticket
        if (state.selectedTicket && state.selectedTicket.ticketId === action.payload.ticketId) {
          state.selectedTicket = action.payload.ticket;
        }
      })
      .addCase(assignTicket.rejected, (state, action) => {
        state.statusLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, clearSelectedTicket } = adminSupportSlice.actions;
export default adminSupportSlice.reducer;

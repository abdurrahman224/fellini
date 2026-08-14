import { createSlice } from '@reduxjs/toolkit';
import { createTicket, getUserTickets, getTicketById, replyToTicket } from './supportAPI';

const initialState = {
  tickets: [],
  pagination: null,
  selectedTicket: null,
  loading: false,
  detailLoading: false,
  replyLoading: false,
  error: null,
  success: null,
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Ticket created successfully';
        state.tickets.unshift(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user tickets
      .addCase(getUserTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUserTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get ticket by ID
      .addCase(getTicketById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(getTicketById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Reply to ticket
      .addCase(replyToTicket.pending, (state) => {
        state.replyLoading = true;
        state.error = null;
      })
      .addCase(replyToTicket.fulfilled, (state, action) => {
        state.replyLoading = false;
        state.success = 'Reply sent successfully';
        // Add new message to selected ticket
        if (state.selectedTicket && state.selectedTicket.ticketId === action.payload.ticket.ticketId) {
          state.selectedTicket.messages.push(action.payload.ticketMessage);
        }
        // Update ticket in list
        const ticketIndex = state.tickets.findIndex(t => t.ticketId === action.payload.ticket.ticketId);
        if (ticketIndex !== -1) {
          state.tickets[ticketIndex] = {
            ...state.tickets[ticketIndex],
            ...action.payload.ticket,
            _count: {
              ...state.tickets[ticketIndex]._count,
              messages: (state.tickets[ticketIndex]._count?.messages || 0) + 1
            }
          };
        }
      })
      .addCase(replyToTicket.rejected, (state, action) => {
        state.replyLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearSelectedTicket } = supportSlice.actions;
export default supportSlice.reducer;

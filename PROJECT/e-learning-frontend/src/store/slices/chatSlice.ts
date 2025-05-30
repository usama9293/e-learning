import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  timestamp: string;
  isRead: number;
}

export interface Participant {
  id: number;
  name: string;
  role: string;
}

export interface Conversation {
  id: number;
  participants: Participant[];
  messages: Message[];
  created_at: string;
  updated_at: string;
}

interface ChatState {
  conversations: Conversation[];
  selectedConversationId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  selectedConversationId: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk('chat/fetchConversations', async () => {
  const response = await axios.get('/api/v1/chat/conversations');
  return response.data;
});

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (participantIds: number[]) => {
    const response = await axios.post('/api/v1/chat/conversations', { participant_ids: participantIds });
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: number) => {
    const response = await axios.get(`/api/v1/chat/conversations/${conversationId}/messages`);
    return { conversationId, messages: response.data };
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, content }: { conversationId: number; content: string }) => {
    const response = await axios.post(`/api/v1/chat/conversations/${conversationId}/messages`, { content });
    return { conversationId, message: response.data };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectConversation(state, action: PayloadAction<number>) {
      state.selectedConversationId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.push(action.payload);
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
        if (conversation) {
          conversation.messages = action.payload.messages;
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
        if (conversation) {
          conversation.messages.push(action.payload.message);
        }
      });
  },
});

export const { selectConversation } = chatSlice.actions;
export default chatSlice.reducer; 
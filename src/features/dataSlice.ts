import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state and the type
interface DataState {
  data: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DataState = {
  data: [],
  status: 'idle',
  error: null,
};

// Create an async thunk for fetching data
export const fetchData = createAsyncThunk<any[], void>('data/fetchData', async () => {
  const response = await axios.get('https://api.github.com/users'); 
  return response.data;
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    hello : (state, action) : void => {
      console.log("hello : ", action.payload)
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});
export const { hello } = dataSlice.actions;
export default dataSlice.reducer;

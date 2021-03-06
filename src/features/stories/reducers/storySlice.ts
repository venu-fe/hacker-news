import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../storiesAPI';

const { getStoryById } = api;

interface Story {
    by: string;
    descendants: number;
    id: number;
    kids: Array<number>;
    score: number;
    text?: string;
    url: string;
    time: number;
    title: string;
    type: "story";
    loadingStatus: 'idle' | 'loading' | 'failed' | 'succeeded';
    error?: string;
};

type individualStory = {
    [key:string]: Story;
};

export interface storyState {
    stories: individualStory;
};

const initialState: storyState = {
    stories: {},
};

export const getStoryByIdAsync = createAsyncThunk(
    'story/storyById',
    async (storyId: number) => {
      const response = await getStoryById(storyId);

      if (response.error) {
          return response.error;
      }
      // The value we return becomes the `fulfilled` action payload
      return response.story || null;
    }
);

export const storySlice = createSlice({
    name: 'storyById',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        initializeStory: (state, action: PayloadAction<number>) => {
            state.stories = {
                ...state.stories,
                [action.payload.toString()]: {
                    loadingStatus: 'idle',
                } as Story,
            };
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
      builder
        .addCase(getStoryByIdAsync.pending, (state, action) => {
            state.stories = {
                ...state.stories,
                [action.meta.arg.toString()]: {
                    loadingStatus: 'loading',
                }  as Story,
            };
        })
        .addCase(getStoryByIdAsync.fulfilled, (state, action) => {
            state.stories = {
                ...state.stories,
                [action.meta.arg.toString()]: {
                    loadingStatus: 'succeeded',
                    ...action.payload,
                },
            };
        })
        .addCase(getStoryByIdAsync.rejected, (state, action) => {
            state.stories = {
                ...state.stories,
                [action.meta.arg.toString()]: {
                    loadingStatus: 'failed',
                    error: action.error,
                } as Story,
            };
          });
    },
});

export const { initializeStory } = storySlice.actions;
  
export default storySlice.reducer;

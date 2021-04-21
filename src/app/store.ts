import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import topStoriesReducer from '../features/stories/reducers/topStoriesSlice';
import storyReducer from '../features/stories/reducers/storySlice';
import commentReducer from '../features/stories/reducers/commentsSlice';

export const store = configureStore({
  reducer: {
    topStories: topStoriesReducer,
    story: storyReducer,
    comments: commentReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

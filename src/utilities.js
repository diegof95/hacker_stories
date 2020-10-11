import React from 'react';

export function useTempStorage(key) {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || ''
  )
  React.useEffect(
    () => {
      localStorage.setItem(key, value);
    },
    [value, key]
  )

  return [value, setValue]
}

export function storiesReducer(state, action){
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        loading: true,
        error: false
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: false
      }
    case 'STORIES_FETCH_ERROR':
      return {
        ...state,
        error: true,
        loading: false
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => (action.payload.objectID !== story.objectID)
        )
      }
    default:
      throw new Error();
  }
}

export const getSumComments = (stories) => {
  return stories.data.reduce(
    (result, value) => (result + value.num_comments),
    0
  );
};
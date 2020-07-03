import React, { useState, useEffect, useReducer } from 'react'
import './App.css'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

function useTempStorage(key) {
  const [value, setValue] = useState(
    localStorage.getItem(key) || ''
  )
  
  useEffect(
    () => {
      localStorage.setItem(key, value);
    },
    [value, key]
  )

  return [value, setValue]
}

function storiesReducer(state, action){
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        loading: true,
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
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

// Just fetching and returning promise
function getStories(searchTerm) {
  return(
    fetch(`${API_ENDPOINT}${searchTerm}`)
  )
}

function App(props){
  
  const [searchTerm, setSearchTerm] = useTempStorage('searchTerm')
  const [stories, dispatchStories] = useReducer(
      storiesReducer,
      {
        data: [],
        loading: false,
        error: false
      }
      // stories now is an object that encasulates info about loading or error in stories fetching
    )

  // Data fetching
  useEffect(
    () => {
      // Empty search term doesn't fetch and cleans results
      if(searchTerm.trim() === ''){
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: []
        })
        return
      }

      dispatchStories({type: 'STORIES_FETCH_INIT'})

      getStories(searchTerm)
        .then((response) => (
          response.json()
        ))
        .then((result) => (
          dispatchStories({
            type: 'STORIES_FETCH_SUCCESS',
            payload: result.hits,
          })
        ))
        .catch(() => (
          dispatchStories({type: 'STORIES_FETCH_ERROR'})
        ))
    },
    [searchTerm]
  )

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleRemove = (toDelete) => {
    dispatchStories(
      {
        type: 'REMOVE_STORY',
        payload: { objectID: toDelete.objectID}
      }
    )
  }
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <LabeledInput
        id="search"
        value={searchTerm}
        handler={handleChange}
      >
        Search: 
      </LabeledInput>
      <hr />
      { stories.error && <p>Something went wrong loading data...</p> }
      { stories.loading ?
        <p>Loading data...</p>
        :
        <List
          list={ stories.data }
          handleRemove={handleRemove}
        />
      }
    </div>
  )
}

function LabeledInput({id, type="text", value, handler, children}){
  return(
    <>
    <label htmlFor={id}>{children}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={handler}
    />
    </>
  )
}

function List(props){

 return(
    props.list.map( (item) => (
      <div key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
          <button
            type="button"
            onClick={() => (props.handleRemove(item))}>
            {/*inline handler */}
              Dismiss
          </button>
      </span>
      </div>
    ))
  )
}

export default App
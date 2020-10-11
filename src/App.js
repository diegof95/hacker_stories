import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react'
import axios from 'axios'
import './App.css'
import CheckLogo from './check.svg'
import 'regenerator-runtime/runtime' // Temp fix to: ReferenceError: regeneratorRuntime is not defined

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

function useTempStorage(key) {
  const [value, setValue] = useState(
    localStorage.getItem(key) || ''
  )
  const isMounted = useRef(false);
  useEffect(
    () => {
      // Using the ref.current we avoid local storage setting in mounting render
      if(isMounted.current){
        console.log(`Not first render. Local storage setting`);
        localStorage.setItem(key, value);
      }else{
        isMounted.current = true;
      };
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

function App(props){
  
  const [searchTerm, setSearchTerm] = useTempStorage('searchTerm')
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`)
  const [stories, dispatchStories] = useReducer(
      storiesReducer,
      {
        data: [],
        loading: false,
        error: false
      }
    )

  // Data fetching. Using useCallback to return memoized function
  const getStories = useCallback(() => {
    // React warns about using async funct with a effect funct on useEffect
    // Since useCallback returns the funct that useEffect uses, we work around it
    const fetch_data = async () => {
      // Empty search term doesn't fetch and cleans results
      if(searchTerm.trim() === ''){
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: []
        })
        return
      }
      
      dispatchStories({type: 'STORIES_FETCH_INIT'})

      const result = await axios.get(url)

      try {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        })
      }
      catch {
        dispatchStories({type: 'STORIES_FETCH_ERROR'})
      }
    }

    fetch_data()
  },
  [url]
  )
  
  useEffect(
    getStories,
    [getStories]
  )

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearch = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault()
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
    <div className="container">
      <h1 className="title">My Hacker Stories</h1>
      <form className="" onSubmit={handleSearch}>
        <LabeledInput
          id="search"
          value={searchTerm}
          handler={handleChange}
        >
          Search: 
        </LabeledInput>
        <button className="button button-large" type="submit">
          Go
        </button>
      </form>
      <hr />
      { stories.error && <p>Something went wrong loading data...</p> }
      { stories.loading ?
        <p>Loading data...</p>
        :
        <List
          list={ stories.data }
          handleRemove={ handleRemove }
        />
      }
    </div>
  )
}

function LabeledInput({id, type="text", value, handler, children}){
  return(
    <>
    <label htmlFor={id} className="label">{children}</label>
    <input
      id={id}
      className="input"
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
     <Item
        key={item.objectID}
        item={item}
        handleRemove={props.handleRemove}
      />
    ))
  );
}

function Item({item, handleRemove}){
  return(
    <div className="item">
      <span style={{width: '40%'}}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{width: '30%'}}>{item.author}</span>
      <span style={{width: '10%'}}>{item.num_comments}</span>
      <span style={{width: '10%'}}>{item.points}</span>
      <span style={{width: '10%'}}>
        <button
          className="button button-small"
          type="button"
          onClick={() => (handleRemove(item))}>
          {/*inline handler */}
            <CheckLogo height="18px" width="18px"/>
        </button>
      </span>
    </div>
  );
}

export default App
import React from 'react'
import axios from 'axios'
import {useTempStorage, storiesReducer, getSumComments} from './utilities'
import List from './List'
import SearchForm from './SearchForm'
import './styles.css'
import 'regenerator-runtime/runtime' // Temp fix to: ReferenceError: regeneratorRuntime is not defined

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

function App(props){

  const [searchTerm, setSearchTerm] = useTempStorage('searchTerm')
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)
  const [stories, dispatchStories] = React.useReducer(
      storiesReducer,
      {
        data: [],
        loading: false,
        error: false
      }
    )

  const getStories = () => { 
    const fetch = async () => {
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
    fetch();  
  }
  
  React.useEffect(
    getStories,
    [url]
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
  
  const sumComments = getSumComments(stories)

  return (
    <div className="container">
      <h1 className="title">News From Hacker Stories with {sumComments} comments.</h1>
      <SearchForm
        searchTerm={searchTerm}
        handleChange={handleChange}
        handleSearch={handleSearch}
      />
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

export default App
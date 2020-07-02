import React, { useState, useEffect } from 'react'
import './App.css'
import data from './data'

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

function getStories() {
  return(
    new Promise((resolve, reject) => (
      setTimeout(
        () => resolve({stories: data}),
        2000
      )))
  )
}

function App(props){
  
  const [searchTerm, setSearchTerm] = useTempStorage('searchTerm')
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(
    () => {
      getStories()
        .then((result) => {
          setStories(result.stories);
          setLoading(false)
        })
        .catch(() => {
          setError(true)
          setLoading(false)
        })
    },
    []
  )

  const filterBySearch = (searchTerm) => (
    stories.filter(
      (item) => (
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  )

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleRemove = (toDelete) => {
    setStories((prevStories) => (
      prevStories.filter(
        (item) => (item.objectID != toDelete.objectID)
      )
    ))
  }
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <LabeledInput
        id="search"
        label="Search"
        value={searchTerm}
        handler={handleChange}
      >
        Search: 
      </LabeledInput>
      <hr />
      { error && <p>Something went wrong loading data...</p> }
      { loading ?
        <p>Loading data...</p>
        :
        <List
          list={ filterBySearch(searchTerm) }
          handleRemove={handleRemove}
        />
      }
    </div>
  )
}

function LabeledInput({id, label, type="text", value, handler, children}){
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
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

function App(props){
  
  const[searchTerm, setSearchTerm] = useTempStorage('searchTerm')
  const[stories, setStories] = useState(data)
  
  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }
  
  const filterBySearch = (search) => (
    stories.filter(
      (item) => (
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  )

  const handleRemove = (toDelete) => {
    setStories((prevStories) => (
      prevStories.filter(
        (item) => (item.objectID != toDelete.objectID)
      )
    ))
  }

  /* Time complexity, linear too but more operations
  const handleRemove = (toDelete) => {
    setStories((prevStories) => {
        const index = prevStories.indexOf(toDelete)
        return ([
          ...prevStories.slice(0, index),
          ...prevStories.slice(index + 1)
        ])
    })
  }*/
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <LabeledInput
        id="search"
        label="Search"
        value={searchTerm}
        handler={handleChange} />
      <hr />
      <List
        list={ filterBySearch(searchTerm) }
        handleRemove={handleRemove}
      />
    </div>
  )
}

function LabeledInput({id, label, type="text", value, handler}){
  return(
    <>
    <label htmlFor={id}>{label}: </label>
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
import React from 'react';
import LabeledInput from './LabeledInput';
import './styles.css';

const SearchForm = ({searchTerm, handleChange, handleSearch}) => (
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
)

export default SearchForm;
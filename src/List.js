import React from 'react';
import CheckLogo from './check.svg'
import {sortBy} from 'lodash'
import './styles.css'

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
  POINT: (list) => sortBy(list, 'points').reverse(),
};

const List = ({list, handleRemove}) => {
  
  const [sort, setSort] = React.useState('NONE');

  const handleSort = (value) => {
    setSort(value);
  }

  const sortFunction = SORTS[sort];
  const sortedList = sortFunction(list);

  return(
    <>
    <div className="header">
      <button style={{width: '40%'}}
        onClick={() => handleSort('TITLE')}
      >
        Article
      </button>
      <button style={{width: '30%'}}
        onClick={() => handleSort('AUTHOR')}
      >
        Author
      </button>
      <button style={{width: '10%'}}
        onClick={() => handleSort('COMMENT')}
      >
        Comments
      </button>
      <button style={{width: '10%'}}
        onClick={() => handleSort('POINT')}
      >
        Points
      </button>
      <span style={{width: '10%'}}>
        Checked
      </span>
    </div>
    { sortedList.map( (item) => (
        <Item
          key={item.objectID}
          item={item}
          handleRemove={handleRemove}
        />
      ))
    }
    </>
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

export default List;
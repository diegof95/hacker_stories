import React from 'react';
import CheckLogo from './check.svg'
import './styles.css'

const List = (props) => {
  
  const [sort, setSort] = React.useState('title');

  return(
    <>
    <div className="header">
      <button style={{width: '40%'}}
      
      >
        Article
      </button>
      <button style={{width: '30%'}}
      
      >
        Author
      </button>
      <button style={{width: '10%'}}
      
      >
        Comments
      </button>
      <button style={{width: '10%'}}
        
      >
        Points
      </button>
      <span style={{width: '10%'}}>
        Checked
      </span>
    </div>
    { props.list.map( (item) => (
        <Item
          key={item.objectID}
          item={item}
          handleRemove={props.handleRemove}
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
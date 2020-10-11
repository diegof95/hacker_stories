import React from 'react';
import './styles.css'

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

export default LabeledInput;
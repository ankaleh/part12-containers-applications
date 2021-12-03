import React, { useState } from 'react'

const TodoForm = ({ createTodo }) => {
  const [text, setText] = useState('')

  const onChange = ({ target }) => {
    setText(target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createTodo({ text })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
    <form onSubmit={handleSubmit}>
      <input type="text" name="text" value={text} onChange={onChange} />
      <button type="submit"> Submit </button>
    </form>
    </div>
  )
}

export default TodoForm

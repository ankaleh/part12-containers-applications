import React from 'react'
import { Link } from 'react-router-dom'


const TodoList = ({ todos }) => {

  return (
    <>
      {todos.map(todo => {
        return (
          <div key={todo._id} style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
            <Link to={`/${todo._id}`} >
              <span >
                {todo.text}
              </span>
            </Link>
          </div>
        )
      }).reduce((acc, cur) => [...acc, <hr key={acc}/>, cur], [])}
    </>
  )
}

export default TodoList

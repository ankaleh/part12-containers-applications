import React, { useEffect, useState } from 'react'
import axios from '../util/apiClient'
import { useParams } from 'react-router-dom'

import List from './List'
import Form from './Form'
import SingleTodo from './SingleTodo'

const TodoView = () => {
  const id = useParams().id
  const [todos, setTodos] = useState([])

  const refreshTodos = async () => {
    const { data } = await axios.get('/todos')
    setTodos(data)
  }

  useEffect(() => {
   refreshTodos()
  }, [])

  const createTodo = async (todo) => {
    const { data } = await axios.post('/todos', todo)
    setTodos([...todos, data])
  }

  const deleteTodo = async (event, todo) => {
    event.preventDefault()
    await axios.delete(`/todos/${todo._id}`)
    refreshTodos()
  }

  const completeTodo = async (event, todo) => {
    event.preventDefault()
    await axios.put(`/todos/${todo._id}`, {
      text: todo.text,
      done: true
    })
    refreshTodos()
  }


  if (id) {
    const todo = todos.find(t => t._id === id)
    if (todo) {
      return (
        <SingleTodo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo}/>
      )
    }
  }
  
  return (
    <>
      <h1 style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: '40px' }}>
        Todos
      </h1>
      <Form createTodo={createTodo} />
      <List todos={todos} />
    </>
  )
}

export default TodoView

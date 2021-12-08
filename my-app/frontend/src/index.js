/* eslint-disable no-undef */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from 'apollo-link-context'

//import { onError } from 'apollo-link-error'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('mokkikirja-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}`: null,
    }
  }
})

const httpLink = process.env.NODE_ENV==='development'
  ?  new HttpLink({
    uri: 'http://localhost:4000/graphql'
  })
  : new HttpLink({
    uri: '/graphql'
  })

/* const logoutLink = onError(({ networkError }) => {
  if (networkError.statusCode === 401) {
    localStorage.clear()
    client.resetStore()
    alert('Sinun täytyy kirjautua uudestaan!')
    history.push('/kirjaudu')
  }
}) */

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  /* link: logoutLink.concat(authLink.concat(httpLink)), */
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
)


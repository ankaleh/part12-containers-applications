import { useApolloClient, useMutation } from '@apollo/client'
import { loader } from 'graphql.macro'
import { useHistory } from 'react-router-dom'

const LOGIN = loader('../graphql/mutations/login.graphql')

const useSignIn = (showNotification) => {
  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      showNotification(`Tapahtui virhe: ${error.graphQLErrors[0].message}`)
    }
  })
  const client = useApolloClient()
  const history = useHistory()

  const signIn = async (username, password) => {
    const result = await login({ variables: {
      username, password
    } })
    localStorage.setItem('mokkikirja-token', result.data.login.value)
    client.resetStore()
    if (result.data) {
      showNotification('Kirjautuminen onnistui!')
      history.push('/vieraskirja')
    }
    return result
  }
  console.log(result)
  return [signIn, result]

}
export default useSignIn
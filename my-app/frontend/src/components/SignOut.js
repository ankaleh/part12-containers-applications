import React from 'react'
import { useApolloClient } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { Button } from '../styles/button'
import { Info, Page, Row } from '../styles/div'
import { InfoText } from '../styles/textStyles'

const SignOut = (props) => {
  const client = useApolloClient()
  const history = useHistory()
  const handleClick = () => {
    localStorage.clear()
    client.resetStore()
    props.showNotification('Kirjauduit ulos!')
    history.push('/')
  }


  return (
    <Page flexDirection='row' justifyContent='center' alignItems='center'>
      <Info>
        <InfoText>Haluatko varmasti kirjautua ulos?</InfoText>
        <Row>
          <Button type='submit' onClick={handleClick} background='#618685'>Kyllä</Button>
          <Button type='submit' onClick={() => history.goBack()} background='#618685'>En</Button>
        </Row>
      </Info>
    </Page>
  )
}

export default SignOut
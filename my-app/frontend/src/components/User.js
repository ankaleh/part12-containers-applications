import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import { Navigation, AccountInfo, Column, Row } from '../styles/div'
import { LinkText, WhiteText } from '../styles/textStyles'

const ME = loader('../graphql/queries/me.graphql')

const User = (props) => {

  const  { data, error, loading } = useQuery(ME)
  const [ user, setUser ] = useState(null)

  useEffect(() => {
    if (data) {
      setUser(data.me)
    }
    else if (error) {
      props.showNotification(`Tapahtui virhe: ${error.message}`)
    }
  }, [data])

  if (loading) {
    return (
      <div>Käyttäjätietoja haetaan</div>
    )
  }
  return (
    <div>
      {user
        ?   <div>
          <AccountInfo>
            <Row>
              <Column>
                <WhiteText>{user.name}</WhiteText>
                <LinkText to='/kirjaudu-ulos'>Kirjaudu ulos</LinkText>
              </Column>
            </Row>
          </AccountInfo>
          <Navigation>
            <LinkText to='/tyopaivakirja'>Työpäiväkirja</LinkText>
            <LinkText to='/vieraskirja'>Vieraskirja</LinkText>
            <LinkText to={'/varaukset'}>Varaa mökki</LinkText>
          </Navigation>
        </div>
        :   <div>
          <AccountInfo><LinkText to='/kirjaudu'>Kirjaudu sisään</LinkText></AccountInfo>
          <Navigation>
            <LinkText to='/rekisteroidy'>Rekisteröidy</LinkText>
          </Navigation>
        </div>
      }

    </div>
  )
}
export default User
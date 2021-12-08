import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/client'
import Post from './Post'
import { Page, Column, BackgroundImage } from '../styles/div'
import { TextPrimary, InfoText, BlackText, HeadingSecondary, LinkTextColored, HeaderInImage } from '../styles/textStyles'
import AddPost from './AddPost'
import { StyledPost, Row, Borderline } from '../styles/div'
import { Input } from '../styles/input'
import format from 'date-fns/format'


import FlatList from 'flatlist-react'

import imageSummer from '../images/imageSummer.jpg'

const ALL_POSTS = loader('../graphql/queries/allPosts.graphql')

const Posts = (props) => {
  const allPosts = useQuery(ALL_POSTS)
  const [ posts, setPosts ] = useState(null)
  const id = useParams().id

  const [ searchInput, setSearchInput ] = useState('')

  const renderPost = (p) => {
    return (
      <LinkTextColored key={p.id} to={`/vieraskirja/${p.id}`}>
        <StyledPost>
          <TextPrimary>{p.startDate} - {p.endDate}</TextPrimary>
          <Row>
            <TextPrimary>
              {`${p.guests.concat(p.unidentifiedGuests)[0]}...`}
            </TextPrimary>
          </Row>
        </StyledPost>
      </LinkTextColored>
    )
  }

  useEffect(() => {
    if (allPosts.data) {
      //console.log(allPosts.data.allPosts)
      setPosts(allPosts.data.allPosts)
    }
    if (allPosts.error) {
      console.log('Virheviesti palvelimelta: ', allPosts.error.message)
      props.showNotification(`Tapahtui virhe: ${allPosts.error.message}`)
    }
  }, [allPosts])

  if (props.notification) {
    return  null
  }

  if (allPosts.loading) {
    return <InfoText>Vieraskirjaa haetaan.</InfoText>
  }

  if (!posts) {
    return <InfoText>Vieraskirjan hakeminen ei onnistunut. Oletko kirjautunut sisään?</InfoText>
  }

  if (id) {
    const post = posts.find(p => p.id === id)
    return (
      <Post post={post} showNotification={props.showNotification}/>
    )
  }

  const onSearchInput = (event) => {
    setSearchInput(event.target.value)
  }

  return (
    <div>
      <BackgroundImage height='250px' backgroundImage={imageSummer}><HeaderInImage>Vieraskirja</HeaderInImage></BackgroundImage>
      <Page flexDirection='row' justifyContent='space-around'>

        <Column>
          <HeadingSecondary>Vieraskirja</HeadingSecondary>
          <BlackText>Voit tehdä hakuja vieraskirjasta kirjoittajan, vieraan nimen ja vierailun ajankohdan perusteella. </BlackText>
          <Input width='260px' border='2px solid lightgrey' value={searchInput} onChange={onSearchInput} placeholder='Nimi tai vierailun ajankohta'/>
          <FlatList
            list={posts.map(p => {
              const post = { ...p,
                startDate: format(new Date(p.startDate), 'dd.MM.yyyy'),
                endDate: format(new Date(p.endDate), 'dd.MM.yyyy'),
                guests: p.guests.map(g => g.name) }
              return post
            })}
            renderItem={renderPost}
            renderWhenEmpty={() => <BlackText>Ei osumia</BlackText>}
            searchBy={['writtenBy.name', 'startDate', 'endDate', 'unidentifiedGuests', 'guests']}
            searchTerm={searchInput}
          />
        </Column>
        <Borderline></Borderline>
        <AddPost showNotification={props.showNotification}/>
      </Page>
    </div>

  )

}
export default Posts
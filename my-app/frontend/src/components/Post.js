import React, { useState } from 'react'
import { useApolloClient, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { Row, Page, StyledTextContainer, BackgroundImage } from '../styles/div'
import { BlackText, HeaderInImage, TextPrimary, TextSecondary } from '../styles/textStyles'
import { Button } from '../styles/button'

import format from 'date-fns/format'
import { loader } from 'graphql.macro'

import imageSummer from '../images/imageSummer.jpg'
import imageAutumn from '../images/imageAutumn.jpg'
import imageWinter from '../images/imageWinter.jpg'
import imageWater from '../images/imageWater.jpg'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const ME = loader('../graphql/queries/me.graphql')
const REMOVE_POST = loader('../graphql/mutations/removePost.graphql')
const ALL_POSTS = loader('../graphql/queries/allPosts.graphql')

const Post = ({ post, showNotification }) => {

  const [dialogOpen, setDialogOpen] = useState(false)

  const allGuests = post.guests.map(g => g.name).concat(post.unidentifiedGuests)

  const getImage = () => {
    const month = new Date(post.startDate).getMonth()
    if (month>9 || month<2) {
      return imageWinter
    }
    if (month>8) {
      return imageAutumn
    }
    else if (month>4) {
      return imageSummer
    }

    return imageWater
  }

  const [ removePost ] = useMutation(REMOVE_POST, {
    onError: (error) => {
      showNotification(`Tapahtui virhe: ${error&&error.graphQLErrors[0]?error.graphQLErrors[0].extensions.exception.errors:{}}`)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_POSTS })
      if (dataInStore) {
        store.evict({
          fieldName: 'allPosts',
          broadcast: false,
        })
        store.writeQuery({
          query: ALL_POSTS,
          data: {
            allPosts: dataInStore.allPosts.filter(p => p.id !== response.data.removePost.id)
          }
        })
      }
    } })

  const client = useApolloClient()
  const data = client.readQuery({ query: ME })
  const history = useHistory()
  //console.log(data.me.name)

  const handleClickRemove = async (event, id) => {
    try {
      removePost({
        variables: { id }
      })
      history.push('/vieraskirja')
      showNotification('Merkintä on nyt poistettu!')
    } catch(e) {
      console.log(e)
      showNotification(`Tapahtui virhe: ${e}`)
    }
  }

  const handleClickOpen = () => {
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false)
  }

  return (
    <div>
      <BackgroundImage height='400px' backgroundImage={() => getImage()}><HeaderInImage bottom='0%'>{`${format(new Date(post.startDate), 'dd.MM.yyyy')} - ${format(new Date(post.endDate), 'dd.MM.yyyy')}`}</HeaderInImage></BackgroundImage>
      <Page flexDirection='column' alignItems='center'>
        <BlackText>{post.writtenBy.name} kirjoitti:</BlackText>

        <StyledTextContainer>
          <TextSecondary>{post.text}</TextSecondary>
        </StyledTextContainer>

        <Row><TextPrimary>{allGuests.reduce((prev, curr) => `${prev}, ${curr}`)}</TextPrimary></Row>
        {data.me.id === post.writtenBy.id
          ? <div><Button background='lightgrey' /* height='40px' */ width='500px' onClick={handleClickOpen}>Poista merkintä</Button>
            <Dialog
              open={dialogOpen}
              onClose={handleClose}
            >
              <DialogTitle >{'Haluatko varmasti poistaa merkinnän?'}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                Jos poistat vieraskirjamerkinnän, se ei ole enää palautettavissa. Haluatko silti poistaa sen?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button background='lightgrey' onClick={handleClose}>
                En halua
                </Button>
                <Button background='lightgrey' onClick={(e) => {
                  handleClose()
                  handleClickRemove(e, post.id)}} >
                Haluan
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          : null}
      </Page>
    </div>
  )
}
export default Post

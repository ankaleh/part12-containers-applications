import React, { useState } from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import { Navigation, Margin, BackgroundImage } from './styles/div'
import Notification from './components/Notification'
import { HeaderInImage, LiInImage } from './styles/textStyles'
import Posts from './components/Posts'
import Tasks from './components/Tasks'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import SignOut from './components/SignOut'
import User from './components/User'
import Reservations from './components/Reservations'

import imageSummer from './images/imageSummer.jpg'
import 'react-calendar/dist/Calendar.css'


const App = () => {
  const [ notification, setNotification ] = useState('')

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <Router>
      {notification
        ? <Notification notification={notification}/>
        : <Margin></Margin>}

      <User showNotification={showNotification}/>

      <Switch>
        <Route path='/rekisteroidy'>
          <SignUp showNotification={showNotification}/>
        </Route>
        <Route path='/kirjaudu'>
          <SignIn showNotification={showNotification}/>
        </Route>
        <Route path='/kirjaudu-ulos'>
          <SignOut showNotification={showNotification}/>
        </Route>
        <Route path='/tyopaivakirja'>
          <Tasks showNotification={showNotification}/>
        </Route>
        <Route path='/vieraskirja/:id'>
          <Posts showNotification={showNotification}/>
        </Route>
        <Route path='/vieraskirja'>
          <Posts showNotification={showNotification}/>
        </Route>
        <Route path='/varaukset'>
          <Reservations showNotification={showNotification}/>
        </Route>

        <BackgroundImage height='600px' backgroundImage={imageSummer}>
          <HeaderInImage >Meidän mökki</HeaderInImage>
          <LiInImage bottom='50%'>Vieraskirja</LiInImage>
          <LiInImage bottom='10%' >Työpäiväkirja</LiInImage>
          <LiInImage bottom='30%'>Varaukset</LiInImage>
        </BackgroundImage>

      </Switch>

      <Navigation>
      </Navigation>
      {notification
        ? <Notification notification={notification}/>
        : <Margin> </Margin>}
    </Router>
  )
}

export default App

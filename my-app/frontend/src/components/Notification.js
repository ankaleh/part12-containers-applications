import { NotificationMessage } from '../styles/div'
import { InfoText, ErrorText } from '../styles/textStyles'
import React from 'react'

const Notification = ({ notification }) => {

  if (!notification) {
    return null
  }

  if (notification.includes('Tapahtui virhe')) {
    return (
      <NotificationMessage>
        <ErrorText>{notification}</ErrorText>
      </NotificationMessage>

    )
  }

  return (
    <NotificationMessage>
      <InfoText>{notification}</InfoText>
    </NotificationMessage>
  )
}

export default Notification

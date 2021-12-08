import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Column, Page, Borderline, BackgroundImage } from '../styles/div'
import { BlackText, HeadingSecondary, HeaderInImage } from '../styles/textStyles'
import { Button } from '../styles/button'
import { loader } from 'graphql.macro'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'

import format from 'date-fns/format'
import { areIntervalsOverlapping } from 'date-fns'
import CustomCalendar from './CustomCalendar'

import imageGoldeneye from '../images/imageGoldeneye.jpg'

const ADD_RESERVATION = loader('../graphql/mutations/addReservation.graphql')
const ALL_RESERVATIONS = loader('../graphql/queries/allReservations.graphql')
const ME = loader('../graphql/queries/me.graphql')
const REMOVE_RESERVATION = loader('../graphql/mutations/removeReservation.graphql')

const Reservations = (props) => {
  const client = useApolloClient()
  const me = client.readQuery({ query: ME })
  const history = useHistory()

  const [selectedDayRange, setSelectedDayRange] = useState([])
  const [reservedDayRanges, setReservedDayRanges] = useState([]) //taulukko, jonka alkioina taulukot kunkin varauksen päivämääristä
  const [myReservations, setMyReservations] = useState([])

  const allReservations/* { data, error, loading } */ = useQuery(ALL_RESERVATIONS)
  const [addReservation /* , result */ ] = useMutation(ADD_RESERVATION, {
    onError: (error) => {
      props.showNotification(`Tapahtui virhe: ${error&&error.graphQLErrors[0]?error.graphQLErrors[0].extensions.exception.errors:{}}`)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_RESERVATIONS })
      if (dataInStore) {
        store.writeQuery({
          query: ALL_RESERVATIONS,
          data: {
            allReservations: [...dataInStore.allReservations, response.data.addReservation ]
          }
        })
      }
    }
  })

  const [ removeReservation ] = useMutation(REMOVE_RESERVATION, {
    onError: (error) => {
      props.showNotification(`Tapahtui virhe: ${error&&error.graphQLErrors[0]?error.graphQLErrors[0].extensions.exception.errors:{}}`)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_RESERVATIONS })
      if (dataInStore) {
        store.evict({
          fieldName: 'allReservations',
          broadcast: false,
        })
        store.writeQuery({
          query: ALL_RESERVATIONS,
          data: {
            allReservations: dataInStore.allReservations.filter(p => p.id !== response.data.removeReservation.id)
          }
        })
      }

    } })


  useEffect(() => {
    if (allReservations.data) {
      setReservedDayRanges(allReservations.data.allReservations.map(r => [ r.startDate, r.endDate ]))
      setMyReservations(allReservations.data.allReservations.filter(r => r.reservedBy.id === me.me.id))
    }
    if (allReservations.error) {
      props.showNotification(`Tapahtui virhe: ${allReservations.error.message}`)
    }
  }, [allReservations])

  const handleClickBook = async () => {
    console.log('startDate: ', selectedDayRange[0], 'endDate: ', selectedDayRange[1])
    if (selectedDayRange.length<2) {
      props.showNotification('Tapahtui virhe: lisää saapumis- ja lähtöpäivä!')
    } else {
      try {
        await addReservation({
          variables: {
            startDate: format(selectedDayRange[0], 'yyyy-MM-dd'),
            endDate: format(selectedDayRange[1], 'yyyy-MM-dd')
          }
        })
        props.showNotification('Varaus on nyt tehty! Näet sen tällä sivulla.')

      } catch(e) {
        props.showNotification(`Tapahtui virhe: ${e}`)
      }
    }

  }

  //tarkistaa, sisältääkö kalenterista valittu ajanjakso varattuja päiviä
  const checkDayRange = (dayRange) => {
    if (dayRange.length===2) {
      const a =  reservedDayRanges.map(array => {
        return areIntervalsOverlapping(
          { start: new Date(array[0]), end: new Date(array[1]) },
          { start: new Date(dayRange[0]), end: new Date(dayRange[1]) }
        )
      })
      if (a.find(b => b===true)) {
        props.showNotification('Tapahtui virhe: Valitsemasi ajanjakso sisältää varattuja päiviä. Yritä uudestaan!')
      } else {
        setSelectedDayRange(dayRange)
      }
    } else {
      setSelectedDayRange(dayRange)
    }

  }

  const handleClickRemove = async (event, id) => {
    try {
      removeReservation({
        variables: { id }
      })
      history.push('/varaukset')
      props.showNotification('Varaus on nyt poistettu!')
    } catch(e) {
      console.log(e)
      props.showNotification(`Tapahtui virhe: ${e}`)
    }
  }

  return (
    <div>
      <BackgroundImage height='250px' backgroundImage={imageGoldeneye}><HeaderInImage>Varaukset</HeaderInImage></BackgroundImage>
      <Page flexDirection='row' justifyContent='space-around'>
        {myReservations.length!==0
          ? <Column><HeadingSecondary>Varauksesi</HeadingSecondary>
            {myReservations.map(r =>
              <Column key={r.id}>
                <BlackText>
                  {format(new Date(r.startDate), 'dd.MM.yyyy')} - {format(new Date(r.endDate), 'dd.MM.yyyy')}
                </BlackText>
                <Button background='lightgrey' onClick={(e) => handleClickRemove(e, r.id)}>Poista varaus</Button>
              </Column>
            )
            }
          </Column>
          : <HeadingSecondary>Sinulla ei ole tällä <br/>
        hetkellä varauksia</HeadingSecondary>}
        <Borderline></Borderline>
        <Column>
          <HeadingSecondary>Varaa mökki</HeadingSecondary>
          <BlackText>Valitse kalenterista saapumis- ja lähtöpäivä.</BlackText>
          <CustomCalendar checkDayRange={checkDayRange} reservedDayRanges={reservedDayRanges} selectedDayRange={selectedDayRange} />
          <Button background='lightgrey'
            onClick={() => handleClickBook()}>Tee varaus</Button>
        </Column>

      </Page>
    </div>
  )

}
export default Reservations

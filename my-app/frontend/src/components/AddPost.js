import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { loader } from 'graphql.macro'
import { useMutation, useQuery } from '@apollo/client'

import { Button } from '../styles/button'
import { Column } from '../styles/div'
import { BlackText, InfoText, HeadingSecondary } from '../styles/textStyles'

import CustomCalendar from './CustomCalendar'
import format from 'date-fns/format'
import '../styles/calendar.css'
import AddTextAndGuestsForm from './AddTextAndGuestsForm'

const ADD_POST = loader('../graphql/mutations/addPost.graphql')
const ALL_POSTS = loader('../graphql/queries/allPosts.graphql')
const All_USERS = loader('../graphql/queries/allUsers.graphql')

const AddPost = (props) => {

  const allUsers = useQuery(All_USERS)
  const [users, setUsers] = useState([])
  const [addPost /* , result */ ] = useMutation(ADD_POST, {
    onError: (error) => {
      props.showNotification(`Tapahtui virhe: ${error&&error.graphQLErrors[0]?error.graphQLErrors[0].extensions.exception.errors:{}}`)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_POSTS })
      if (dataInStore) {
        store.writeQuery({
          query: ALL_POSTS,
          data: {
            allPosts: [...dataInStore.allPosts, response.data.addPost]
          }
        })
      }
    }

  })

  const [calendarVisible, setCalendarVisible] = useState(false)
  const [selectedDayRange, setSelectedDayRange] = useState([])
  const [datesNotAdded, setDatesNotAdded] = useState(false)
  const showWhenCalendarVisible = { display: calendarVisible ? '' : 'none' }

  /* fetch all users for the form field guests: */
  useEffect(() => {
    if (allUsers.data) {
      setUsers(allUsers.data.allUsers)
    }
    if (allUsers.error) {
      console.log('Virheviesti palvelimelta: ', allUsers.error.message)
      props.showNotification(`Tapahtui virhe: ${allUsers.error.message}`)
    }
  }, [allUsers])


  const onSubmit = async (values, { resetForm }) => {
    const { text, unidentifiedGuests, guests } = values
    if (selectedDayRange.length<2) {
      props.showNotification('Tapahtui virhe: Lisää päivämäärät!')
      return
    }

    try {
      await addPost({ variables: {
        startDate: format(selectedDayRange[0], 'yyyy-MM-dd'),
        endDate: format(selectedDayRange[1], 'yyyy-MM-dd'),
        text,
        unidentifiedGuests,
        guests: guests.map(u => u.id)
      } })
      resetForm({})
      props.showNotification('Vieraskirjamerkintäsi on nyt tallennettu!')
      setSelectedDayRange([])
      setCalendarVisible(false)
    } catch (e) {
      console.log(e)
    }
  }

  const validationSchema = yup.object().shape({
    text: yup
      .string()
      .required('Teksti vaaditaan.'),
    guests: yup
      .array()
      .when('unidentifiedGuests', {
        is: unidentifiedGuests => unidentifiedGuests.length === 0,
        then: yup.array().min(1, 'Lisää vähintään yksi vieras!')
      }),
    unidentifiedGuests: yup
      .array()
      .of(
        yup.string()
          .required('Lisää nimi tai paina Poista.')
          .min(2, 'Nimessä on oltava vähintään kaksi kirjainta.')
      )

  })

  const checkDayRange = (dayRange) => {
    setSelectedDayRange(dayRange)
  }

  if (allUsers.loading) {
    return <InfoText>Tietoja haetaan.</InfoText>
  }

  return (
    <Column>
      <HeadingSecondary>Kirjoita vieraskirjaan</HeadingSecondary>
      <div style={showWhenCalendarVisible}>
        <CustomCalendar datesNotAdded={datesNotAdded} checkDayRange={checkDayRange} reservedDayRanges={[]} selectedDayRange={selectedDayRange}/>
      </div>
      <Button type='submit' background='lightgrey' onClick={() => {
        if (selectedDayRange.length<2 && calendarVisible) {
          setDatesNotAdded(true)
          return
        }
        setCalendarVisible(!calendarVisible)
      }}>{calendarVisible
          ? 'Piilota kalenteri'
          : 'Näytä kalenteri lisätäksesi vierailun ajankohdan'
        }</Button>

      {selectedDayRange.length === 2
        ? <BlackText>{format(selectedDayRange[0], 'dd.MM.yyyy')} - {format(selectedDayRange[1], 'dd.MM.yyyy')}</BlackText>
        : null }

      <Formik initialValues={{ text: '', unidentifiedGuests:[], guests: [] }}
        onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ handleSubmit, values, handleChange, handleBlur, errors, touched }) =>
          <AddTextAndGuestsForm showNotification={props.showNotification} handleSubmit={handleSubmit} values={values} handleChange={handleChange} handleBlur={handleBlur} errors={errors} touched={touched} users={users}/>}
      </Formik>
    </Column>

  )
}
export default AddPost
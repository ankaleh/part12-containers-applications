import React from 'react'
import {  FieldArray } from 'formik'

import { Button } from '../styles/button'
import { Column, GuestsContainer } from '../styles/div'
import { TextSecondary, ErrorText } from '../styles/textStyles'

import FormikInput from './FormikInput'

import '../styles/calendar.css'
import Select from '@material-ui/core/Select'
import { MenuItem } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'

const AddTextAndGuestsForm = ({ showNotification, handleSubmit, values, handleChange, handleBlur, errors, touched, users }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Column>
          <FormikInput name='text' border='2px solid lightgrey' placeholder='Teksti' height='500px' width='500px'/>

          {/* <InputLabel id='select-guests'>Lisää vieraiden nimet</InputLabel>  */}
          <GuestsContainer labelId='select-guests'>
            <Select
              displayEmpty
              name='guests'
              value={values.guests}
              onChange={handleChange}//* ({target}) => setSelectedUsers(target.value)
              onBlur={handleBlur}
              multiple
              /*  input={<Input />}  */
              renderValue={(selectedList) => {//selectedList on lista users-olioita,
                if (selectedList.length===0) {
                  return <TextSecondary>Valitse vieraita mökin jäsenistä</TextSecondary>
                }
                return (
                  <div >
                    {selectedList.map((user) => (
                      <Chip key={user.id} label={user.name} />//jotka renderöidään Chipeinä täällä
                    )
                    )}
                  </div>
                )
              }}
            >
              {users.map(u => <MenuItem key={u.id} value={u}>{u.name}</MenuItem>)/* palvelimelta haetuista käyttäjistä MenuItemeja, joita voi klikata */}
            </Select>
            {errors.guests &&
                    touched.guests &&
                        <ErrorText>
                          {errors.guests}
                        </ErrorText>}
            <FieldArray
              onBlur={handleBlur}
              name='unidentifiedGuests' //tämä yhdistää lomakkeen values-kenttään unidentifiedGuests
              render={arrayHelpers => (
                <div>
                  {values.unidentifiedGuests && values.unidentifiedGuests.length > 0
                    ? (values.unidentifiedGuests.map((guest, index) => (
                      <div key={index}>
                        <FormikInput type='input' name={`unidentifiedGuests.${index}`} />
                        <Button
                          background='lightgrey'
                          type='button'
                          onClick={() => {
                            showNotification(`Vieraslistasta on nyt poistettu ${guest}`)
                            arrayHelpers.remove(index)}} // remove a guest from the unidentifiedGuests list
                        >
                                        Poista
                        </Button>

                        <Button
                          background='lightgrey'
                          type='button'
                          onClick={() => {
                            showNotification(`Vieraslistaan on nyt lisätty ${guest}`)
                            arrayHelpers.insert(index, '')}} // insert an empty string at a position
                        >
                                    Lisää seuraava
                        </Button>
                      </div>
                    ))
                    )
                    : /* show this button when unidentifiedGuests list is empty: */
                    (
                      <Button background='lightgrey' type="button" onClick={() => arrayHelpers.push('')}>
                                 Lisää muita vieraita
                      </Button>
                    )}
                  <div>
                    <Button background='lightgrey' type="submit" onClick={() => {
                      if (values.guests.length!==0 && values.unidentifiedGuests.length!==0) {
                        showNotification(`${values.guests.map(g => g.name)
                          .reduce((prev, curr) => `${prev}, ${curr}`)}, ${values.unidentifiedGuests.reduce((prev, curr) => `${prev}, ${curr}`)}`)
                      } else if (values.unidentifiedGuests.length!==0) {
                        showNotification(`${values.unidentifiedGuests
                          .reduce((prev, curr) => `${prev}, ${curr}`)}`)
                      } else if (values.guests.length!==0) {
                        showNotification(`${values.guests.map(g => g.name)
                          .reduce((prev, curr) => `${prev}, ${curr}`)}`)
                      }
                    }}
                    >
                       Näytä lisäämäsi vieraat
                    </Button>
                  </div>
                </div>
              )}
            />
          </GuestsContainer>

          <Button type='submit' background='lightgrey' height='40px' width='500px' >Lähetä</Button>
        </Column>
      </form>
    </div>
  )
}

export default AddTextAndGuestsForm

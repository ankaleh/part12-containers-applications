import React from 'react'
import { InfoText, ErrorText } from '../styles/textStyles'

import format from 'date-fns/format'
import Calendar from 'react-calendar'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import 'react-calendar/dist/Calendar.css'
import { Column } from '../styles/div'

const CustomCalendar = ({ checkDayRange, reservedDayRanges, selectedDayRange, datesNotAdded }) => {

  const tileDisabled = ({ date }) => {
    if (reservedDayRanges.length>0) {
      //taulukon intervals sisällä on jokaisen varauksen päivämääräintervalli taulukossa
      const intervals = reservedDayRanges.map(datesArray => eachDayOfInterval({
        start: new Date(datesArray[0]),
        end: new Date(datesArray[1])
      }))
      const disabledDays = intervals.flat() //kaikki varatut päivät tässä taulukossa

      return disabledDays.find(dDate => {
        const d = format(dDate, 'yyyy-MM-dd')
        const dd = format(date, 'yyyy-MM-dd')
        return d === dd
      }
      )
    }
  }

  return (
    <Column>
      <Calendar
        onChange={(dayRange) => checkDayRange(dayRange)}
        selectRange={true}
        onClickDay={(value) => checkDayRange([value])}
        tileDisabled={tileDisabled}
      />
      {selectedDayRange.length<2
        ? null
        : <InfoText>{`Valitsemasi päivät: ${format(selectedDayRange[0], 'dd.MM.yyyy')} - ${format(selectedDayRange[1], 'dd.MM.yyyy')}`}</InfoText>}
      {datesNotAdded && selectedDayRange.length===0
        ? <ErrorText>Päivämäärät vaaditaan.</ErrorText>
        : null}
    </Column>
  )

}
export default CustomCalendar
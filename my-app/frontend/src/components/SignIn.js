import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import useSignIn from '../hooks/useSignIn'

import { Button } from '../styles/button'
import { Column, Page } from '../styles/div'
import { BlackText } from '../styles/textStyles'

import FormikInput from './FormikInput'

const SignInForm = ({ onSubmit }) => {

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Column>
          <BlackText>Kirjoita käyttäjätunnuksesi ja salasanasi alla oleviin kenttiin.</BlackText>
          <FormikInput type='input' name='username' border='2px solid lightgrey' placeholder='Käyttäjätunnus' height='40px' width='400px'/>
          <FormikInput type='password' name='password' border='2px solid lightgrey' placeholder='Salasana' height='40px' width='400px'/>
          <Button type='submit' background='lightgrey' height='40px' width='400px'>Kirjaudu sisään</Button>
        </Column>
      </form>
    </div>
  )

}

const SignIn = (props) => {

  const [signIn, result ] = useSignIn(props.showNotification)

  const onSubmit = async (values) => {
    const { username, password } = values
    try {
      await signIn(username, password) // kirjaudutaan
    } catch (e) {
      console.log(e)
    }
  }

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required('Salasana vaaditaan.'),
    username: yup
      .string()
      .required('Käyttäjänimi vaaditaan.')
  })

  if (result.loading) {
    return <div>Kirjaudutaan</div>
  }

  return (
    <Page flexDirection='row' justifyContent='center' alignItems='center'>
      <Formik initialValues={{ username: '', password: '' }}
        onSubmit={onSubmit} validationSchema={validationSchema}>

        {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit} />}

      </Formik>
    </Page>
  )
}
export default SignIn
import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useMutation } from '@apollo/client'

import { Button } from '../styles/button'
import { Column, Page } from '../styles/div'
import { BlackText } from '../styles/textStyles'
import useSignIn from '../hooks/useSignIn'

import FormikInput from './FormikInput'
import { loader } from 'graphql.macro'

const CREATE_USER = loader('../graphql/mutations/createUser.graphql')

const SignUpForm = ({ onSubmit }) => {

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Column>
          <BlackText>Rekisteröidy antamalla nimesi ja valitsemalla käyttäjätunnus ja salasana.</BlackText>
          <FormikInput type='input' name='name' placeholder='Nimi' border='2px solid lightgrey' height='40px' width='400px'/>
          <FormikInput type='input' name='username' placeholder='Käyttäjätunnus' border='2px solid lightgrey' height='40px' width='400px'/>
          <FormikInput type='password' name='password' placeholder='Salasana' border='2px solid lightgrey' height='40px' width='400px'/>
          <FormikInput type='password' name='passwordConf' placeholder='Salasana uudestaan' border='2px solid lightgrey' height='40px' width='400px'/>
          <Button type='submit' background='lightgrey' height='40px' width='400px'>Rekisteröidy</Button>
        </Column>
      </form>
    </div>
  )
}

const SignUp = (props) => {

  const [signIn] = useSignIn(props.showNotification)

  const [createUser /* , result */ ] = useMutation(CREATE_USER, {
    onError: (error) => {
      props.showNotification(`Tapahtui virhe: ${error.graphQLErrors[0].message}`)
    }
  })

  const onSubmit = async (values) => {
    const { name, username, password } = values

    try {
      //rekisteröidytään:
      await createUser({ variables: {
        name,
        username,
        password,

      } })
      //kirjataan käyttäjä sisään:
      await signIn(username, password)

    } catch (e) {
      console.log(e)
    }

  }

  const validationSchema = yup.object().shape({
    name: yup
      .string(),
    username: yup
      .string()
      .min(6, 'Käyttäjänimen on oltava vähintään 6 merkkiä pitkä.').max(30, 'Käyttäjänimen on oltava vähintään 6 merkkiä ja korkeintaan 30 merkkiä pitkä.')
      .required('Käyttäjänimi vaaditaan.'),
    password: yup
      .string()
      .min(7, 'Salasanan on oltava vähintään 7 merkkiä pitkä.').max(50, 'Salasanan on oltava vähintään 7 merkkiä ja korkeintaan 50 merkkiä pitkä.')
      .required('Salasana vaaditaan.'),
    passwordConf: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Tähän kenttään kirjoittamasi salasana ei ole sama kuin edelliseen kenttään kirjoittamasi salasana. Ole hyvä ja yritä uudestaan!')
      .required('Salasanan varmistus vaaditaan.'),
  })
  //Formikin sisällä (lapsena) on funktio, joka saa parametrikseen Formikin funktion, joka puolestaan annetaan
  //kirjautumislomakkeelle propsina.
  return (
    <Page flexDirection='row' justifyContent='center' alignItems='center'>
      <Formik initialValues={{ name: '', username: '', password: '', passwordConf: '' }}
        onSubmit={onSubmit} validationSchema={validationSchema}>

        {({ handleSubmit }) => <SignUpForm onSubmit={handleSubmit} />}

      </Formik>
    </Page>
  )

}

export default SignUp
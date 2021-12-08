import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { loader } from 'graphql.macro'
import { useMutation } from '@apollo/client'

import { Button } from '../styles/button'
import { Column } from '../styles/div'
import { HeadingSecondary } from '../styles/textStyles'

import FormikInput from './FormikInput'

const ADD_TASK = loader('../graphql/mutations/addTask.graphql')
const ALL_TASKS = loader('../graphql/queries/allTasks.graphql')

const TaskForm = ({ onSubmit }) => {

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Column>
          <HeadingSecondary>Lisää työ</HeadingSecondary>
          <FormikInput name='description' border='2px solid lightgrey' placeholder='Työn kuvaus' height='60px' width='500px'/>
          <Button type='submit' background='lightgrey' height='40px' width='500px'>Tallenna</Button>
        </Column>
      </form>
    </div>
  )

}

const AddTask = (props) => {

  const [addTask /* , result */ ] = useMutation(ADD_TASK, {
    onError: (error) => {
      props.showNotification(`Tapahtui virhe: ${error&&error.graphQLErrors[0]?error.graphQLErrors[0].extensions.exception.errors:{}}`)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_TASKS })
      if (dataInStore) {
        store.writeQuery({
          query: ALL_TASKS,
          data: {
            allTasks: [...dataInStore.allTasks, response.data.addTask]
          }
        })
      }
    }

  })

  const onSubmit = async (values, { resetForm }) => {
    const { description } = values

    try {
      await addTask({ variables: {
        description
      } })
      resetForm({})
      props.showNotification('Työ on nyt tallennettu!')
    } catch (e) {
      console.log(e)
    }
  }

  const validationSchema = yup.object().shape({
    description: yup
      .string()
      .min(5)
      .required('Kuvaus vaaditaan.')
  })

  return (
    <Formik initialValues={{ description: '' }}
      onSubmit={onSubmit} validationSchema={validationSchema}>

      {({ handleSubmit }) => <TaskForm onSubmit={handleSubmit} />}

    </Formik>

  )
}
export default AddTask
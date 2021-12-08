import React from 'react'
import { useField } from 'formik'
import { ErrorText } from '../styles/textStyles'
import { Text, Input } from '../styles/input'

const FormikInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name)
  const showError = meta.touched && meta.error

  if (props.type==='input' || props.type === 'password') {

    return (<>
      <Input
        onChange={({ target }) => {
          helpers.setValue(target.value)}}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && <ErrorText>{meta.error}</ErrorText>}
    </>)
  }

  return (
    <>
      <Text
        onChange={({ target }) => {
          helpers.setValue(target.value)}}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && <ErrorText>{meta.error}</ErrorText>}
    </>
  )
}
export default FormikInput


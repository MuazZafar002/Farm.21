import * as React from 'react'



export const formData = (values: any) => {
  const [formValues, setFormValues] = React.useState({
    ...values,
  })

  const handleFormValueChange = (key: any, value: any) => {
    setFormValues({
      ...formValues,
      [key]: value,
    })
  }

  return [formValues, handleFormValueChange]
}

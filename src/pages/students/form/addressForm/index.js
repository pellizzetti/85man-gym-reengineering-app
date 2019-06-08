import React from 'react';
import { Box, FormField, MaskedInput, TextInput } from 'grommet';

const AddressForm = ({ errors, handleChange, setFieldValue, values }) => (
  <Box>
    <FormField label="CEP" error={errors.postal_code}>
      <MaskedInput
        name="postal_code"
        mask={[
          {
            length: 5,
            regexp: /^[0-9]{1,5}$/,
            placeholder: 'XXXXX'
          },

          { fixed: '-' },
          {
            length: 3,
            regexp: /^[0-9]{1,3}$/,
            placeholder: 'XXX'
          }
        ]}
        value={values.postal_code || ''}
        onChange={event => setFieldValue('postal_code', event.target.value)}
      />
    </FormField>
    <FormField label="Logradouro" error={errors.street}>
      <TextInput
        name="street"
        value={values.street || ''}
        onChange={handleChange}
      />
    </FormField>
    <FormField label="Número" error={errors.number}>
      <TextInput
        name="number"
        value={values.number || ''}
        onChange={handleChange}
      />
    </FormField>
    <FormField label="Bairro" error={errors.neighborhood}>
      <TextInput
        name="neighborhood"
        value={values.neighborhood || ''}
        onChange={handleChange}
      />
    </FormField>
    <FormField label="Cidade" error={errors.city}>
      <TextInput
        name="city"
        value={values.city || ''}
        onChange={handleChange}
      />
    </FormField>
    <FormField label="UF" error={errors.state}>
      <TextInput
        name="state"
        value={values.state || ''}
        onChange={handleChange}
      />
    </FormField>
  </Box>
);

export default AddressForm;

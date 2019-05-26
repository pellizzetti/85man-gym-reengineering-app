import React from 'react';
import {
  Box, CheckBox, FormField, MaskedInput, Select, TextInput,
} from 'grommet';

const PersonalDataForm = ({
  errors, handleChange, setFieldValue, values,
}) => (
  <Box>
    <FormField label="Nome" error={errors.name}>
      <TextInput name="name" value={values.name || ''} onChange={handleChange} />
    </FormField>
    <FormField label="Nascimento" error={errors.birthday}>
      <MaskedInput
        name="birthday"
        mask={[
          {
            length: 2,
            regexp: /^[1-2][0-9]$|^3[0-1]$|^0?[1-9]$|^0$/,
            placeholder: 'DD',
          },

          { fixed: '/' },
          {
            length: 2,
            regexp: /^1[0,1-2]$|^0?[1-9]$|^0$/,
            placeholder: 'MM',
          },
          { fixed: '/' },
          {
            length: 4,
            options: Array.from({ length: 100 }, (v, k) => `${2019 - k}`),
            regexp: /^[1-2]$|^19$|^20$|^19[0-9]$|^20[0-9]$|^19[0-9][0-9]$|^20[0-9][0-9]$/,
            placeholder: 'YYYY',
          },
        ]}
        value={values.birthday || ''}
        onChange={event => setFieldValue('birthday', event.target.value)}
      />
    </FormField>
    <FormField label="Sexo" error={errors.gender}>
      <Select
        name="gender"
        options={['Feminino', 'Masculino']}
        value={values.size || 'Feminino'}
        onChange={event => setFieldValue('gender', event.value)}
      />
    </FormField>
    <FormField label="Ativo" error={errors.active}>
      <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
        <CheckBox
          name="active"
          checked={values.active || false}
          onChange={event => setFieldValue('active', event.target.checked)}
          toggle
        />
      </Box>
    </FormField>
    <FormField label="Fone" error={errors.phone}>
      <MaskedInput
        name="phone"
        mask={[
          { fixed: '(' },
          {
            length: 2,
            regexp: /^[0-9]{1,2}$/,
            placeholder: 'XX',
          },
          { fixed: ')' },
          { fixed: ' ' },
          {
            length: 4,
            regexp: /^[0-9]{1,4}$/,
            placeholder: 'XXXX',
          },
          { fixed: '-' },
          {
            length: 4,
            regexp: /^[0-9]{1,4}$/,
            placeholder: 'XXXX',
          },
        ]}
        value={values.telephone || ''}
        onChange={event => setFieldValue('telephone', event.target.value)}
      />
    </FormField>
    <FormField label="Celular" error={errors.cellphone}>
      <MaskedInput
        name="cellphone"
        mask={[
          { fixed: '(' },
          {
            length: 2,
            regexp: /^[0-9]{1,2}$/,
            placeholder: 'XX',
          },
          { fixed: ')' },
          { fixed: ' ' },
          {
            length: 4,
            regexp: /^[0-9]{1,4}$/,
            placeholder: 'XXXX',
          },
          { fixed: '-' },
          {
            length: 4,
            regexp: /^[0-9]{1,4}$/,
            placeholder: 'XXXX',
          },
        ]}
        value={values.cellphone || ''}
        onChange={event => setFieldValue('cellphone', event.target.value)}
      />
    </FormField>
    <FormField label="E-mail" error={errors.email}>
      <TextInput name="email" type="email" value={values.email || ''} onChange={handleChange} />
    </FormField>
  </Box>
);

export default PersonalDataForm;

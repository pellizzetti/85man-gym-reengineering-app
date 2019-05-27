import React from 'react';
import {
  Box, CheckBox, FormField, Grid, RadioButtonGroup, Select, TextInput,
} from 'grommet';
import { FieldArray } from 'formik';
import styled from 'styled-components';

const RowRadioButtonGroup = styled(RadioButtonGroup)`
  flex-direction: row;
  padding: 1.5px;

  & > div {
    margin-left: 10px;
  }
`;

const reasons = [
  'Aprender a nadar',
  'Bronquite',
  'Coluna',
  'Obesidade',
  'Treinar',
  'Manter a forma',
  'Gestante',
  'Conselho médico',
  'Outros',
];

const through = [
  'Jornal',
  'Placa',
  'Cartaz',
  'Panfleto',
  'Amigos',
  'Outdoor',
  'Internet',
  'Passando em frente',
  'Aluno da academia',
];

const QuizForm = ({
  errors,
  handleClose,
  handleChange,
  handleSearch,
  options,
  defaultOptions,
  setFieldValue,
  values,
}) => (
  <Box>
    <Grid
      fill
      areas={[
        { name: 'healthInsuranceToggle', start: [0, 0], end: [0, 0] },
        { name: 'healthInsuranceInput', start: [1, 0], end: [1, 0] },
        { name: 'playSportToggle', start: [2, 0], end: [2, 0] },
        { name: 'playSportInput', start: [3, 0], end: [3, 0] },
      ]}
      columns={['small', 'flex', 'small', 'flex']}
      rows={['flex']}
      gap="small"
    >
      <Box gridArea="healthInsuranceToggle">
        <FormField label="Plano de saúde?" error={errors.quiz && errors.quiz.has_health_insurance}>
          <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
            <RowRadioButtonGroup
              name="quiz.has_health_insurance"
              options={[{ label: 'Sim', value: 'true' }, { label: 'Não', value: 'false' }]}
              value={values.quiz.has_health_insurance ? 'true' : 'false'}
              onChange={event => setFieldValue('quiz.has_health_insurance', event.target.value)}
            />
          </Box>
        </FormField>
      </Box>
      <Box gridArea="healthInsuranceInput">
        <FormField label="Qual?" error={errors.quiz && errors.quiz.health_insurance}>
          <TextInput
            name="quiz.health_insurance"
            value={values.quiz.health_insurance || ''}
            onChange={handleChange}
          />
        </FormField>
      </Box>
      <Box gridArea="playSportToggle">
        <FormField label="Pratica esporte?" error={errors.quiz && errors.quiz.play_sport}>
          <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
            <RowRadioButtonGroup
              name="quiz.play_sport"
              options={[{ label: 'Sim', value: 'true' }, { label: 'Não', value: 'false' }]}
              value={values.quiz.play_sport ? 'true' : 'false'}
              onChange={event => setFieldValue('quiz.play_sport', event.target.value)}
            />
          </Box>
        </FormField>
      </Box>
      <Box gridArea="playSportInput">
        <FormField label="Qual?" error={errors.quiz && errors.quiz.sport}>
          <TextInput name="quiz.sport" value={values.quiz.sport || ''} onChange={handleChange} />
        </FormField>
      </Box>
    </Grid>

    <FormField label="Por que faz academia?" error={errors.quiz && errors.quiz.reason_for_doing}>
      <Grid
        fill="horizontal"
        columns={{
          count: 4,
          size: 'auto',
        }}
        gap="small"
      >
        <FieldArray
          name="quiz.reason_for_doing"
          render={arrayHelpers => (
            <>
              {reasons.map(reason => (
                <Box key={reason} pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                  <CheckBox
                    name="quiz.reason_for_doing"
                    label={reason}
                    value={reason}
                    checked={
                      values.quiz.reason_for_doing
                        ? values.quiz.reason_for_doing.includes(reason)
                        : false
                    }
                    onChange={(event) => {
                      if (event.target.checked) {
                        arrayHelpers.push(reason);
                      } else {
                        const idx = values.quiz.reason_for_doing.indexOf(reason);
                        arrayHelpers.remove(idx);
                      }
                    }}
                    toggle
                  />
                </Box>
              ))}
              <FormField label="Especifique" error={errors.quiz && errors.quiz.other_reason}>
                <TextInput
                  name="quiz.other_reason"
                  value={values.quiz.other_reason || ''}
                  onChange={handleChange}
                />
              </FormField>
            </>
          )}
        />
      </Grid>
    </FormField>

    <FormField label="Como soube da academia?" error={errors.quiz && errors.quiz.found_out_through}>
      <Grid
        fill="horizontal"
        columns={{
          count: 4,
          size: 'auto',
        }}
        gap="small"
      >
        <FieldArray
          name="quiz.found_out_through"
          render={arrayHelpers => (
            <>
              {through.map(per => (
                <Box key={per} pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                  <CheckBox
                    name="quiz.found_out_through"
                    label={per}
                    value={per}
                    checked={
                      values.quiz.found_out_through
                        ? values.quiz.found_out_through.includes(per)
                        : false
                    }
                    onChange={(event) => {
                      if (event.target.checked) {
                        arrayHelpers.push(per);
                      } else {
                        const idx = values.quiz.found_out_through.indexOf(per);
                        arrayHelpers.remove(idx);
                      }
                    }}
                    toggle
                  />
                </Box>
              ))}
              <FormField label="Qual aluno?" error={errors.quiz && errors.quiz.referral}>
                <Select
                  name="quiz.referral"
                  labelKey="name"
                  valueKey="id"
                  options={options}
                  value={(values.quiz.referral && values.quiz.referral.name) || ''}
                  onChange={event => setFieldValue('quiz.referral', event.value)}
                  onClose={handleClose}
                  onSearch={handleSearch}
                  emptySearchMessage="Não encontrado"
                />
              </FormField>
            </>
          )}
        />
      </Grid>
    </FormField>
  </Box>
);

export default QuizForm;

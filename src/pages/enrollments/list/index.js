import React from 'react';
import { Text } from 'grommet';

import PagedList from '~/components/PagedList';

const columns = [
  {
    name: 'id',
    title: 'ID',
    getCellValue: datum => <Text>{datum.id}</Text>
  },
  {
    name: 'student',
    title: 'Aluno',
    getCellValue: datum => (
      <Text>{(datum.student && datum.student.name) || 'Nenhum aluno'}</Text>
    )
  },
  {
    name: 'contract_length',
    title: 'Duração',
    getCellValue: datum => (
      <Text>{`${datum.contract_length} ${
        datum.contract_length > 1 ? 'meses' : 'mês'
      }`}</Text>
    )
  },
  {
    name: 'registration_fee',
    title: 'Taxa de inscrição',
    getCellValue: datum => (
      <Text>
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(datum.registration_fee)}
      </Text>
    )
  },
  {
    name: 'monthly_payment',
    title: 'Mensalidade',
    getCellValue: datum => (
      <Text>
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(datum.monthly_payment)}
      </Text>
    )
  },
  {
    name: 'enrollment_date',
    title: 'Data da matrícula',
    getCellValue: datum => <Text>{datum.enrollment_date}</Text>
  }
];

const columnExtensions = [
  { columnName: 'id', align: 'left', width: 60 },
  { columnName: 'edit', width: 170 }
];

function EnrollmentsList() {
  return (
    <PagedList
      columns={columns}
      columnExtensions={columnExtensions}
      resource="enrollments"
      singular="matrícula"
    />
  );
}

export default EnrollmentsList;

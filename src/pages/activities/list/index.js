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
    name: 'description',
    title: 'Descrição',
    getCellValue: datum => <Text>{datum.description}</Text>
  },
  {
    name: 'instructor',
    title: 'Instrutor',
    getCellValue: datum => (
      <Text>
        {(datum.instructor && datum.instructor.name) || 'Nenhum instrutor'}
      </Text>
    )
  }
];

const columnExtensions = [
  { columnName: 'id', align: 'left', width: 60 },
  { columnName: 'edit', width: 170 }
];

function ActivitiesList() {
  return (
    <PagedList
      columns={columns}
      columnExtensions={columnExtensions}
      resource="activities"
      singular="atividade"
    />
  );
}

export default ActivitiesList;

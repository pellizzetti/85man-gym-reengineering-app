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
    name: 'name',
    title: 'Nome',
    getCellValue: datum => <Text>{datum.name}</Text>
  },
  {
    name: 'doc',
    title: 'CPF',
    getCellValue: datum => <Text>{datum.doc}</Text>
  }
];

const columnExtensions = [
  { columnName: 'id', align: 'left', width: 60 },
  { columnName: 'edit', width: 170 }
];

function IntructorsList() {
  return (
    <PagedList
      columns={columns}
      columnExtensions={columnExtensions}
      resource="instructors"
      singular="instrutor"
      plural="instrutores"
    />
  );
}

export default IntructorsList;

import React from 'react';
import { Box, CheckBox, Text } from 'grommet';
import { UserAdd } from 'grommet-icons';

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
    name: 'cellphone',
    title: 'Celular',
    getCellValue: datum => <Text>{datum.cellphone}</Text>
  },
  {
    name: 'active',
    title: 'Ativo',
    getCellValue: datum => (
      <Box align="center" justify="center" pad={{ vertical: 'xsmall' }}>
        <CheckBox checked={datum.active} readOnly />
      </Box>
    )
  }
];

const columnExtensions = [
  { columnName: 'id', align: 'left', width: 60 },
  { columnName: 'active', align: 'center', width: 120 },
  { columnName: 'edit', width: 170 }
];

function StudentsList() {
  return (
    <PagedList
      columns={columns}
      columnExtensions={columnExtensions}
      resource="students"
      singular="aluno"
      addIcon={UserAdd}
    />
  );
}

export default StudentsList;

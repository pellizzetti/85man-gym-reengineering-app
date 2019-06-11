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
      <Text>{(datum.student && datum.student.name) || 'Visitante'}</Text>
    )
  },
  {
    name: 'item_count',
    title: 'Quantidade de produtos',
    getCellValue: datum => (
      <Text>{`${datum.quantity_total} ${
        datum.quantity_total > 1 ? 'produto' : 'produtos'
      }`}</Text>
    )
  },
  {
    name: 'total',
    title: 'Valor total',
    getCellValue: datum => (
      <Text>
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(datum.total)}
      </Text>
    )
  }
];

const columnExtensions = [
  { columnName: 'id', align: 'left', width: 60 },
  { columnName: 'edit', width: 170 }
];

function OrdersList() {
  return (
    <PagedList
      columns={columns}
      columnExtensions={columnExtensions}
      resource="orders"
      singular="venda"
    />
  );
}

export default OrdersList;

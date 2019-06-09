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
    name: 'quantity',
    title: 'Quantidade',
    getCellValue: datum => <Text>{datum.quantity}</Text>
  },
  {
    name: 'amount',
    title: 'Valor unitário',
    getCellValue: datum => (
      <Text>
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(datum.amount)}
      </Text>
    )
  }
];

const columnExtensions = [
  { columnName: 'id', align: 'left', width: 60 },
  { columnName: 'edit', width: 170 }
];

function ProductsList() {
  return (
    <PagedList
      columns={columns}
      columnExtensions={columnExtensions}
      resource="products"
      singular="produto"
    />
  );
}

export default ProductsList;

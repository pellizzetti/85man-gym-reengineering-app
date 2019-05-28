import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, Heading, Text,
} from 'grommet';
import { Edit, Add } from 'grommet-icons';
import { Spinning } from 'grommet-controls';
import { PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import {
  Grid, Table, TableHeaderRow, PagingPanel,
} from 'dx-react-grid-grommet';
import { toast } from 'react-toastify';

import { StripedTable } from './styles';

import api from '~/services/api';

class ProductsList extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  state = {
    results: [],
    loading: true,
    totalCount: 0,
    pageSize: 5,
    currentPage: 0,
    columns: [
      {
        name: 'id',
        title: 'ID',
        getCellValue: datum => <Text>{datum.id}</Text>,
      },
      {
        name: 'description',
        title: 'Description',
        getCellValue: datum => <Text>{datum.description}</Text>,
      },
      {
        name: 'quantity',
        title: 'Quantidade',
        getCellValue: datum => <Text>{datum.quantity}</Text>,
      },
      {
        name: 'amount',
        title: 'Valor unitário',
        getCellValue: datum => (
          <Text>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              datum.amount,
            )}
          </Text>
        ),
      },
      {
        name: 'edit',
        title: 'Ação',
        getCellValue: (datum) => {
          const { history } = this.props;
          return (
            <Button
              icon={<Edit color="brand" />}
              label="Editar"
              onClick={() => history.push(`/products/edit/${datum.id}`)}
            />
          );
        },
      },
    ],
  };

  async componentDidMount() {
    await this.loadData();
  }

  loadData = async (currentPage = 0) => {
    try {
      const {
        data: { results, total: totalCount },
      } = await api.get('/products', { params: { currentPage } });

      this.setState({
        results,
        totalCount,
        loading: false,
      });
    } catch (err) {
      toast.error('Erro ao buscar produtos da API. :(');
      console.error(err);
      this.setState({
        results: [],
        totalCount: 0,
        loading: false,
      });
    }
  };

  changeCurrentPage = async (currentPage) => {
    this.setState({
      loading: true,
      currentPage,
    });
    await this.loadData(currentPage);
  };

  render() {
    const {
      loading, columns, results, pageSize, currentPage, totalCount,
    } = this.state;
    const { history } = this.props;

    return (
      <Box flex pad="small">
        <Box flex="shrink" pad="small" direction="row" justify="between">
          <Heading level={2} margin="none" color="brand">
            Produtos
          </Heading>
          <Button
            icon={<Add color="brand" />}
            label="Adicionar produto"
            onClick={() => history.push('/products/new')}
          />
        </Box>
        <Grid rows={results} columns={columns}>
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
          />
          <CustomPaging totalCount={totalCount} />
          <Table
            columnExtensions={[
              { columnName: 'id', align: 'left', width: 60 },
              { columnName: 'edit', width: 170 },
            ]}
            noDataCellComponent={() => (
              <td colSpan="5">
                <Box align="center">
                  <Text>Nenhum registro</Text>
                </Box>
              </td>
            )}
            tableComponent={StripedTable}
          />
          <TableHeaderRow />
          <PagingPanel messages={{ info: ({ from, to, count }) => `${from}-${to} de ${count}` }} />
          <Box align="center">{loading && <Spinning color="brand" size="large" />}</Box>
        </Grid>
      </Box>
    );
  }
}

export default ProductsList;

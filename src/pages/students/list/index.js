import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, CheckBox, Heading, Text,
} from 'grommet';
import { Edit, UserAdd } from 'grommet-icons';
import { Spinning } from 'grommet-controls';
import { PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import {
  Grid, Table, TableHeaderRow, PagingPanel,
} from 'dx-react-grid-grommet';
import { toast } from 'react-toastify';

import { Separator, StripedTable } from './styles';

import api from '~/services/api';

class StudentsList extends Component {
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
        name: 'name',
        title: 'Nome',
        getCellValue: datum => <Text>{datum.name}</Text>,
      },
      {
        name: 'cellphone',
        title: 'Celular',
        getCellValue: datum => <Text>{datum.cellphone}</Text>,
      },
      {
        name: 'active',
        title: 'Ativo',
        getCellValue: datum => (
          <Box align="center" justify="center" pad={{ vertical: 'xsmall' }}>
            <CheckBox checked={datum.active} readOnly />
          </Box>
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
              onClick={() => history.push(`/students/edit/${datum.id}`)}
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
      } = await api.get('/students', { params: { currentPage } });

      this.setState({
        results,
        totalCount,
        loading: false,
      });
    } catch (err) {
      toast.error('Erro ao buscar alunos da API. :(');
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

    console.log(this.props);

    return (
      <Box flex pad="small">
        <Box flex="shrink" pad="small" direction="row" justify="between">
          <Heading level={2} margin="none" color="brand">
            Alunos
          </Heading>
          <Button
            icon={<UserAdd color="brand" />}
            label="Adicionar usuário"
            onClick={() => history.push('/students/new')}
          />
        </Box>
        <Separator />
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
              { columnName: 'active', align: 'center', width: 120 },
              { columnName: 'edit', width: 170 },
            ]}
            noDataCellComponent={() => (
              <td colSpan="5">
                <span>Nenhum registro</span>
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

export default StudentsList;

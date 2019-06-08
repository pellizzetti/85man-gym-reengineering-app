import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Heading, Text } from 'grommet';
import { Edit, Add } from 'grommet-icons';
import { Spinning } from 'grommet-controls';
import {
  PagingState,
  CustomPaging,
  SearchState
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar,
  SearchPanel
} from 'dx-react-grid-grommet';
import { toast } from 'react-toastify';

import StripedTable from '~/components/StripedTable';

import api from '~/services/api';

class EnrollmentsList extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

  state = {
    results: [],
    loading: true,
    totalCount: 0,
    pageSize: 10,
    currentPage: 0,
    searchValue: '',
    columns: [
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
      },
      {
        name: 'edit',
        title: 'Ação',
        getCellValue: datum => {
          const { history } = this.props;
          return (
            <Button
              icon={<Edit color="brand" />}
              label="Editar"
              onClick={() => history.push(`/enrollments/edit/${datum.id}`)}
            />
          );
        }
      }
    ]
  };

  async componentDidMount() {
    await this.loadData();
  }

  loadData = async (currentPage = 0, search = '') => {
    try {
      const {
        data: { results, total: totalCount }
      } = await api.get('/enrollments', { params: { currentPage, search } });

      this.setState({
        results,
        totalCount,
        loading: false
      });
    } catch (err) {
      toast.error('Erro ao buscar matrículas da API. :(');
      console.error(err);
      this.setState({
        results: [],
        totalCount: 0,
        loading: false
      });
    }
  };

  changeCurrentPage = async currentPage => {
    const { searchValue } = this.state;

    this.setState({
      loading: true,
      currentPage
    });

    await this.loadData(currentPage, searchValue);
  };

  changeSearchValue = async searchValue => {
    this.setState({
      loading: true,
      searchValue,
      currentPage: 0
    });

    await this.loadData(0, searchValue);
  };

  render() {
    const {
      loading,
      columns,
      results,
      pageSize,
      currentPage,
      totalCount
    } = this.state;
    const { history } = this.props;

    return (
      <Box flex pad="small">
        <Box flex="shrink" pad="small" direction="row" justify="between">
          <Heading level={2} margin="none" color="brand">
            Matrículas
          </Heading>
          <Button
            icon={<Add color="brand" />}
            label="Adicionar matrícula"
            onClick={() => history.push('/enrollments/new')}
          />
        </Box>
        <Grid rows={results} columns={columns}>
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
          />
          <CustomPaging totalCount={totalCount} />
          <SearchState onValueChange={this.changeSearchValue} />
          <Table
            columnExtensions={[
              { columnName: 'id', align: 'left', width: 60 },
              { columnName: 'edit', width: 170 }
            ]}
            noDataCellComponent={() => (
              <td colSpan="7">
                <Box align="center">
                  <Text>Nenhum registro</Text>
                </Box>
              </td>
            )}
            tableComponent={StripedTable}
          />
          <TableHeaderRow />
          <Toolbar />
          <SearchPanel
            messages={{ searchPlaceholder: 'Pesquisar matrículas...' }}
          />
          <PagingPanel
            messages={{
              info: ({ from, to, count }) => `${from}-${to} de ${count}`
            }}
          />
          <Box align="center">
            {loading && <Spinning color="brand" size="large" />}
          </Box>
        </Grid>
      </Box>
    );
  }
}

export default EnrollmentsList;

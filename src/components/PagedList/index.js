import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Heading, Text } from 'grommet';
import { Spinning } from 'grommet-controls';
import { Add, Edit } from 'grommet-icons';
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
import { withRouter } from 'react-router-dom';

import StripedTable from '~/components/StripedTable';

import api from '~/services/api';

class PagedList extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    columnExtensions: PropTypes.arrayOf(PropTypes.object).isRequired,
    resource: PropTypes.string.isRequired,
    singular: PropTypes.string.isRequired,
    plural: PropTypes.string,
    addIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
  };

  static defaultProps = {
    plural: null,
    addIcon: Add
  };

  state = {
    results: [],
    loading: true,
    totalCount: 0,
    pageSize: 10,
    currentPage: 0,
    searchValue: ''
  };

  async componentDidMount() {
    await this.loadData();
  }

  loadData = async (currentPage = 0, search = '') => {
    try {
      const { resource } = this.props;

      const {
        data: { results, total: totalCount }
      } = await api.get(`/${resource}`, { params: { currentPage, search } });

      this.setState({
        results,
        totalCount,
        loading: false
      });
    } catch (err) {
      toast.error(`Erro ao buscar ${this.getPlural()} da API. :(`);

      console.error(err);

      this.setState({
        results: [],
        totalCount: 0,
        loading: false
      });
    }
  };

  getPlural = (upperCase = false) => {
    const { singular } = this.props;
    let { plural } = this.props;

    if (!plural) {
      plural = `${singular}s`;
    }

    return upperCase
      ? plural.charAt(0).toUpperCase() + plural.slice(1)
      : plural;
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
    const { loading, results, pageSize, currentPage, totalCount } = this.state;
    const {
      history,
      columns,
      columnExtensions,
      resource,
      singular,
      addIcon: AddIcon
    } = this.props;

    columns.push({
      name: 'edit',
      title: 'Ação',
      getCellValue: datum => {
        return (
          <Button
            icon={<Edit color="brand" />}
            label="Editar"
            onClick={() => history.push(`/${resource}/edit/${datum.id}`)}
          />
        );
      }
    });

    return (
      <Box flex pad="small">
        <Box flex="shrink" pad="small" direction="row" justify="between">
          <Heading level={2} margin="none" color="brand">
            {this.getPlural(true)}
          </Heading>
          <Button
            icon={<AddIcon color="brand" />}
            label={`Adicionar ${singular}`}
            onClick={() => history.push(`/${resource}/new`)}
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
            columnExtensions={columnExtensions}
            noDataCellComponent={() => (
              <td colSpan={columns.length}>
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
            messages={{ searchPlaceholder: `Pesquisar ${this.getPlural()}...` }}
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

export default withRouter(PagedList);

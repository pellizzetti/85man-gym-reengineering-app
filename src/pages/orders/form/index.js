import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormField,
  Grid,
  RadioButtonGroup,
  Heading,
  MaskedInput,
  Select,
  Text
} from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { Spinning } from 'grommet-controls';
import { toast } from 'react-toastify';
import swal from '@sweetalert/with-react';
import { EditingState } from '@devexpress/dx-react-grid';
import {
  Grid as TableGrid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn
} from 'dx-react-grid-grommet';
import styled from 'styled-components';

import StripedTable from '~/components/StripedTable';

import api from '~/services/api';

const RowRadioButtonGroup = styled(RadioButtonGroup)`
  flex-direction: row;
  padding: 1.5px;

  & > div {
    margin-left: 10px;
  }
`;

class OrdersForm extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }).isRequired
  };

  state = {
    defaultOptions: [],
    options: [],
    defaultOptionsPrd: [],
    optionsPrd: [],
    data: {},
    isUpdating: false,
    isLoading: true,
    isSubmitted: false,
    columns: [
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
        title: 'Valor',
        getCellValue: datum => <Text>{datum.amount}</Text>
      }
    ],
    products: [],
    editingStateColumnExtensions: [
      { columnName: 'id', editingEnabled: false },
      { columnName: 'description', editingEnabled: false }
    ],
    orderTotal: 0
  };

  async componentDidMount() {
    try {
      const {
        match: {
          params: { id }
        }
      } = this.props;

      if (id) {
        const [
          { data },
          { data: dataOptions },
          { data: dataOptionsPrd }
        ] = await Promise.all([
          api.get(`/orders/${id}`),
          api.get('/students', { params: { showAll: true } }),
          api.get('/products', { params: { showAll: true } })
        ]);

        let orderTotal = 0;
        data.items.forEach(product => {
          const amount = String(product.amount).replace(/,/g, '.');
          orderTotal += product.quantity * parseFloat(amount);
        });

        this.setState({
          data,
          products: data.items,
          orderTotal,
          options: dataOptions,
          defaultOptions: dataOptions,
          optionsPrd: dataOptionsPrd,
          defaultOptionsPrd: dataOptionsPrd
        });
      } else {
        const [
          { data: dataOptions },
          { data: dataOptionsPrd }
        ] = await Promise.all([
          api.get('/students', { params: { showAll: true } }),
          api.get('/products', { params: { showAll: true } })
        ]);

        this.setState({
          options: dataOptions,
          defaultOptions: dataOptions,
          optionsPrd: dataOptionsPrd,
          defaultOptionsPrd: dataOptionsPrd
        });
      }

      this.setState({ isLoading: false });
    } catch (err) {
      toast.error('Erro ao buscar dados da venda. :(');
      console.error(err);
      this.setState({
        isLoading: false
      });
    }
  }

  static getDerivedStateFromProps(props) {
    return {
      isUpdating: !!props.match.params.id
    };
  }

  handleDelete = async () => {
    try {
      const {
        match: {
          params: { id }
        },
        history
      } = this.props;

      await api.delete(`/orders/${id}`);

      toast.success('Venda excluída com sucesso!');
      history.push('/orders');
    } catch (err) {
      toast.error('Erro ao excluir venda. :(');
      console.error(err);
    }
  };

  handleClose = () => {
    const { defaultOptions } = this.state;

    this.setState({ options: defaultOptions });
  };

  handleSearch = text => {
    const exp = new RegExp(text, 'i');
    const { defaultOptions } = this.state;

    this.setState({
      options: defaultOptions.filter(o => exp.test(o.name))
    });
  };

  handleClosePrd = () => {
    const { defaultOptionsPrd } = this.state;

    this.setState({ optionsPrd: defaultOptionsPrd });
  };

  handleSearchPrd = text => {
    const exp = new RegExp(text, 'i');
    const { defaultOptionsPrd } = this.state;

    this.setState({
      optionsPrd: defaultOptionsPrd.filter(o => exp.test(o.name))
    });
  };

  addProduct = product => {
    const { products: oldProducts } = this.state;

    const products = [...oldProducts];

    product.quantity = '0';
    product.amount = '0';

    products.push(product);

    this.setState({
      products
    });
  };

  commitChanges = ({ changed, deleted }) => {
    let { products, orderTotal } = this.state;

    if (changed) {
      products = products.map(product =>
        changed[product.id] ? { ...product, ...changed[product.id] } : product
      );
    }

    if (deleted) {
      const deletedSet = new Set(deleted);
      products = products.filter(product => !deletedSet.has(product.id));
    }

    products.forEach(product => {
      const amount = String(product.amount).replace(/,/g, '.');
      orderTotal += product.quantity * parseFloat(amount);
    });

    this.setState({ products, orderTotal });
  };

  render() {
    const {
      data,
      isLoading,
      isUpdating,
      isSubmitted,
      options,
      optionsPrd,
      columns,
      products,
      editingStateColumnExtensions,
      orderTotal
    } = this.state;
    const {
      match: {
        params: { id }
      },
      history
    } = this.props;

    return (
      <Box flex pad="small">
        <Box pad="small" direction="row" justify="between">
          <Heading level={2} margin="none" color="brand">
            {`${isUpdating ? 'Editar' : 'Nova'} venda`}
          </Heading>
          <Button
            icon={<LinkPrevious color="brand" />}
            label="Voltar"
            onClick={() => history.push('/orders')}
          />
        </Box>

        {isLoading ? (
          <Box align="center">
            <Spinning color="#F6B968" size="large" />
          </Box>
        ) : (
          <Formik
            initialValues={data}
            validateOnBlur={isSubmitted}
            validateOnChange={isSubmitted}
            onSubmit={async (values, { setSubmitting }) => {
              this.setState({
                isLoading: true
              });

              values.items = products;
              values.type = values.type || 'bar';
              delete values.order_total;

              try {
                await api.postOrPut('/orders', id, {
                  values
                });

                toast.success('Venda salva com sucesso!');
                history.push('/orders');
              } catch (err) {
                toast.error('Erro ao salvar venda. :(');
                console.error(err);
                this.setState({
                  isLoading: false
                });
              }

              setSubmitting();
            }}
          >
            {({ errors, handleSubmit, setFieldValue, values }) => (
              <form
                onSubmit={event => {
                  event.preventDefault();
                  this.setState({ isSubmitted: true });
                  handleSubmit();
                }}
              >
                <Box>
                  <Grid
                    fill="horizontal"
                    columns={{
                      count: 2,
                      size: 'auto'
                    }}
                    gap="small"
                  >
                    <FormField label="Aluno" error={errors.student}>
                      <Select
                        name="student"
                        labelKey="name"
                        valueKey="id"
                        options={options}
                        value={(values.student && values.student.name) || ''}
                        onChange={event =>
                          setFieldValue('student', event.value)
                        }
                        onClose={this.handleClose}
                        onSearch={this.handleSearch}
                        emptySearchMessage="Não encontrado"
                      />
                    </FormField>
                    <FormField label="Data da venda" error={errors.order_date}>
                      <MaskedInput
                        name="order_date"
                        mask={[
                          {
                            length: 2,
                            regexp: /^[1-2][0-9]$|^3[0-1]$|^0?[1-9]$|^0$/,
                            placeholder: 'DD'
                          },

                          { fixed: '/' },
                          {
                            length: 2,
                            regexp: /^1[0,1-2]$|^0?[1-9]$|^0$/,
                            placeholder: 'MM'
                          },
                          { fixed: '/' },
                          {
                            length: 4,
                            options: Array.from(
                              { length: 25 },
                              (v, k) => `${2019 - k}`
                            ),
                            regexp: /^[1-2]$|^19$|^20$|^19[0-9]$|^20[0-9]$|^19[0-9][0-9]$|^20[0-9][0-9]$/,
                            placeholder: 'YYYY'
                          }
                        ]}
                        value={values.order_date || ''}
                        onChange={event =>
                          setFieldValue('order_date', event.target.value)
                        }
                      />
                    </FormField>
                    <FormField
                      label="Condição de pagamento"
                      error={errors.payment_terms}
                    >
                      <MaskedInput
                        name="payment_terms"
                        mask={[
                          {
                            length: [1, 2],
                            regexp: /^[0-9]{1,2}$/
                          }
                        ]}
                        value={values.payment_terms || ''}
                        onChange={event =>
                          setFieldValue('payment_terms', event.target.value)
                        }
                      />
                    </FormField>
                    <FormField label="Tipo da venda" error={errors.type}>
                      <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                        <RowRadioButtonGroup
                          name="type"
                          options={[
                            { label: 'Bar', value: 'bar' },
                            { label: 'Loja', value: 'loja' }
                          ]}
                          value={values.type || 'bar'}
                          onChange={event =>
                            setFieldValue('type', event.target.value)
                          }
                        />
                      </Box>
                    </FormField>
                  </Grid>
                  <FormField label="Produto">
                    <Select
                      name="product"
                      labelKey="description"
                      valueKey="id"
                      options={optionsPrd}
                      onChange={event => this.addProduct(event.value)}
                      onClose={this.handleClosePrd}
                      onSearch={this.handleSearchPrd}
                      emptySearchMessage="Não encontrado"
                    />
                  </FormField>
                  <TableGrid
                    rows={products}
                    columns={columns}
                    getRowId={product => product.id}
                  >
                    <EditingState
                      onCommitChanges={this.commitChanges}
                      defaultEditingRowIds={[0]}
                      columnExtensions={editingStateColumnExtensions}
                    />
                    <Table
                      noDataCellComponent={() => (
                        <td colSpan="6">
                          <Box align="center">
                            <Text>Nenhum registro</Text>
                          </Box>
                        </td>
                      )}
                      tableComponent={StripedTable}
                    />
                    <TableHeaderRow />
                    <TableEditRow />
                    <TableEditColumn
                      showEditCommand
                      showDeleteCommand
                      messages={{
                        editCommand: 'Editar',
                        deleteCommand: 'Excluir',
                        commitCommand: 'Salvar',
                        cancelCommand: 'Cancelar'
                      }}
                    />
                  </TableGrid>
                  <Box align="end" pad="medium">
                    <Text size="medium">
                      Valor da compra:{' '}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(orderTotal)}
                    </Text>
                  </Box>
                </Box>

                <Box
                  tag="footer"
                  margin={{ top: 'medium', bottom: 'medium' }}
                  direction="row"
                  justify="between"
                >
                  <Button type="submit" primary label="Salvar" />
                  {isUpdating && (
                    <Button
                      type="button"
                      color="status-critical"
                      label="Excluir"
                      onClick={async () => {
                        const deleteOrder = await swal({
                          title: 'Excluir venda?',
                          text: 'Essa ação não poderá ser revertida!',
                          icon: 'warning',
                          buttons: ['Cancelar', 'Excluir']
                        });

                        if (deleteOrder) this.handleDelete();
                      }}
                    />
                  )}
                </Box>
              </form>
            )}
          </Formik>
        )}
      </Box>
    );
  }
}

export default OrdersForm;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormField,
  Grid,
  Heading,
  MaskedInput,
  Select,
  Text,
  TextInput
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

import StripedTable from '~/components/StripedTable';

import api from '~/services/api';

class EnrollmentsForm extends Component {
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
    defaultOptionsAtv: [],
    optionsAtv: [],
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
        name: 'weekdays',
        title: 'Dias da semana',
        getCellValue: datum => <Text>{datum.weekdays}</Text>
      },
      {
        name: 'starts_at',
        title: 'Início',
        getCellValue: datum => <Text>{datum.starts_at}</Text>
      },
      {
        name: 'ends_at',
        title: 'Fim',
        getCellValue: datum => <Text>{datum.ends_at}</Text>
      }
    ],
    activities: [],
    editingStateColumnExtensions: [
      { columnName: 'id', editingEnabled: false },
      { columnName: 'description', editingEnabled: false }
    ]
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
          { data: dataOptionsAtv }
        ] = await Promise.all([
          api.get(`/enrollments/${id}`),
          api.get('/students', { params: { showAll: true } }),
          api.get('/activities', { params: { showAll: true } })
        ]);

        this.setState({
          data,
          activities: data.activities,
          options: dataOptions,
          defaultOptions: dataOptions,
          optionsAtv: dataOptionsAtv,
          defaultOptionsAtv: dataOptionsAtv
        });
      } else {
        const [
          { data: dataOptions },
          { data: dataOptionsAtv }
        ] = await Promise.all([
          api.get('/students', { params: { showAll: true } }),
          api.get('/activities', { params: { showAll: true } })
        ]);

        this.setState({
          options: dataOptions,
          defaultOptions: dataOptions,
          optionsAtv: dataOptionsAtv,
          defaultOptionsAtv: dataOptionsAtv
        });
      }

      this.setState({ isLoading: false });
    } catch (err) {
      toast.error('Erro ao buscar dados da matrícula. :(');
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

      await api.delete(`/enrollments/${id}`);

      toast.success('Matrícula excluída com sucesso!');
      history.push('/enrollments');
    } catch (err) {
      toast.error('Erro ao excluir matrícula. :(');
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

  handleCloseAtv = () => {
    const { defaultOptionsAtv } = this.state;

    this.setState({ optionsAtv: defaultOptionsAtv });
  };

  handleSearchAtv = text => {
    const exp = new RegExp(text, 'i');
    const { defaultOptionsAtv } = this.state;

    this.setState({
      optionsAtv: defaultOptionsAtv.filter(o => exp.test(o.name))
    });
  };

  addActivity = activity => {
    const { activities: oldActivities } = this.state;

    const activities = [...oldActivities];

    activities.push(activity);

    this.setState({
      activities
    });
  };

  commitChanges = ({ changed, deleted }) => {
    let { activities } = this.state;

    if (changed) {
      activities = activities.map(activity =>
        changed[activity.id]
          ? { ...activity, ...changed[activity.id] }
          : activity
      );
    }

    if (deleted) {
      const deletedSet = new Set(deleted);
      activities = activities.filter(activity => !deletedSet.has(activity.id));
    }

    this.setState({ activities });
  };

  render() {
    const {
      data,
      isLoading,
      isUpdating,
      isSubmitted,
      options,
      optionsAtv,
      columns,
      activities,
      editingStateColumnExtensions
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
            {`${isUpdating ? 'Editar' : 'Nova'} matrícula`}
          </Heading>
          <Button
            icon={<LinkPrevious color="brand" />}
            label="Voltar"
            onClick={() => history.push('/enrollments')}
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

              values.activities = activities;

              try {
                await api.postOrPut('/enrollments', id, {
                  values
                });

                toast.success('Matrícula salva com sucesso!');
                history.push('/enrollments');
              } catch (err) {
                toast.error('Erro ao salvar matrícula. :(');
                console.error(err);
                this.setState({
                  isLoading: false
                });
              }

              setSubmitting();
            }}
          >
            {({
              errors,
              handleChange,
              handleSubmit,
              setFieldValue,
              values
            }) => (
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
                    <FormField
                      label="Data do exame"
                      error={errors.examination_date}
                    >
                      <MaskedInput
                        name="examination_date"
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
                              { length: 100 },
                              (v, k) => `${2019 - k}`
                            ),
                            regexp: /^[1-2]$|^19$|^20$|^19[0-9]$|^20[0-9]$|^19[0-9][0-9]$|^20[0-9][0-9]$/,
                            placeholder: 'YYYY'
                          }
                        ]}
                        value={values.examination_date || ''}
                        onChange={event =>
                          setFieldValue('examination_date', event.target.value)
                        }
                      />
                    </FormField>
                    <FormField
                      label="Duração do contrato (meses)"
                      error={errors.contract_length}
                    >
                      <MaskedInput
                        name="contract_length"
                        mask={[
                          {
                            length: [1, 2],
                            regexp: /^[0-9]{1,2}$/
                          }
                        ]}
                        value={values.contract_length || ''}
                        onChange={event =>
                          setFieldValue('contract_length', event.target.value)
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
                    <FormField
                      label="Taxa de inscrição"
                      error={errors.registration_fee}
                    >
                      <TextInput
                        name="registration_fee"
                        value={values.registration_fee || ''}
                        onChange={handleChange}
                      />
                    </FormField>
                    <FormField
                      label="Mensalidade"
                      error={errors.monthly_payment}
                    >
                      <TextInput
                        name="monthly_payment"
                        value={values.monthly_payment || ''}
                        onChange={handleChange}
                      />
                    </FormField>
                  </Grid>
                  <FormField label="Atividade">
                    <Select
                      name="activity"
                      labelKey="description"
                      valueKey="id"
                      options={optionsAtv}
                      onChange={event => this.addActivity(event.value)}
                      onClose={this.handleCloseAtv}
                      onSearch={this.handleSearchAtv}
                      emptySearchMessage="Não encontrada"
                    />
                  </FormField>
                  <TableGrid
                    rows={activities}
                    columns={columns}
                    getRowId={activity => activity.id}
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
                        const deleteEnrollment = await swal({
                          title: 'Excluir matrícula?',
                          text: 'Essa ação não poderá ser revertida!',
                          icon: 'warning',
                          buttons: ['Cancelar', 'Excluir']
                        });

                        if (deleteEnrollment) this.handleDelete();
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

export default EnrollmentsForm;

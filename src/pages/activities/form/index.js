import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box, Button, FormField, Heading, Select, TextInput,
} from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { Spinning } from 'grommet-controls';
import { toast } from 'react-toastify';
import swal from '@sweetalert/with-react';
import * as Yup from 'yup';

import api from '~/services/api';

class ActivitiesForm extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    defaultOptions: [],
    options: [],
    data: {},
    isUpdating: false,
    isLoading: true,
    isSubmitted: false,
  };

  async componentDidMount() {
    try {
      const {
        match: {
          params: { id },
        },
      } = this.props;

      if (id) {
        const [{ data }, { data: dataOptions }] = await Promise.all([
          api.get(`/activities/${id}`),
          api.get('/instructors', { params: { showAll: true } }),
        ]);

        const options = dataOptions.filter(o => o.id !== parseInt(id, 10));

        this.setState({ data, options, defaultOptions: options });
      } else {
        const { data: options } = await api.get('/instructors', { params: { showAll: true } });

        this.setState({ options, defaultOptions: options });
      }

      this.setState({ isLoading: false });
    } catch (err) {
      toast.error('Erro ao buscar dados da atividade. :(');
      console.error(err);
      this.setState({
        isLoading: false,
      });
    }
  }

  static getDerivedStateFromProps(props) {
    return {
      isUpdating: !!props.match.params.id,
    };
  }

  handleDelete = async () => {
    try {
      const {
        match: {
          params: { id },
        },
        history,
      } = this.props;

      await api.delete(`/activities/${id}`);

      toast.success('Atividade excluída com sucesso!');
      history.push('/activities');
    } catch (err) {
      toast.error('Erro ao excluir atividade. :(');
      console.error(err);
    }
  };

  handleClose = () => {
    const { defaultOptions } = this.state;

    this.setState({ options: defaultOptions });
  };

  handleSearch = (text) => {
    const exp = new RegExp(text, 'i');
    const { defaultOptions } = this.state;

    this.setState({
      options: defaultOptions.filter(o => exp.test(o.name)),
    });
  };

  render() {
    const {
      data, isLoading, isUpdating, isSubmitted, options, defaultOptions,
    } = this.state;
    const {
      match: {
        params: { id },
      },
      history,
    } = this.props;

    return (
      <Box flex pad="small">
        <Box pad="small" direction="row" justify="between">
          <Heading level={2} margin="none" color="brand">
            {`${isUpdating ? 'Editar' : 'Novo'} atividade`}
          </Heading>
          <Button
            icon={<LinkPrevious color="brand" />}
            label="Voltar"
            onClick={() => history.push('/activities')}
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
            validationSchema={Yup.object().shape({
              description: Yup.string().required('Campo obrigatório'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              this.setState({
                isLoading: true,
              });

              try {
                await api.postOrPut('/activities', id, {
                  values,
                });

                toast.success('Atividade salva com sucesso!');
                history.push('/activities');
              } catch (err) {
                toast.error('Erro ao salvar atividade. :(');
                console.error(err);
                this.setState({
                  isLoading: false,
                });
              }

              setSubmitting();
            }}
          >
            {({
              errors, handleChange, handleSubmit, setFieldValue, values,
            }) => (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  this.setState({ isSubmitted: true });
                  handleSubmit();
                }}
              >
                <Box>
                  <FormField label="Descrição" error={errors.description}>
                    <TextInput
                      name="description"
                      value={values.description || ''}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField label="Local" error={errors.site}>
                    <TextInput name="site" value={values.site || ''} onChange={handleChange} />
                  </FormField>
                  <FormField label="Instrutor" error={errors.instructor}>
                    <Select
                      name="instructor"
                      labelKey="name"
                      valueKey="id"
                      options={options}
                      value={(values.instructor && values.instructor.name) || ''}
                      onChange={event => setFieldValue('instructor', event.value)}
                      onClose={this.handleClose}
                      onSearch={this.handleSearch}
                      emptySearchMessage="Não encontrado"
                    />
                  </FormField>
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
                      const deleteActivity = await swal({
                        title: 'Excluir atividade?',
                        text: 'Essa ação não poderá ser revertida!',
                        icon: 'warning',
                        buttons: ['Cancelar', 'Excluir'],
                      });

                      if (deleteActivity) this.handleDelete();
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

export default ActivitiesForm;

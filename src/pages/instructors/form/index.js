import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormField,
  Heading,
  MaskedInput,
  TextInput
} from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { Spinning } from 'grommet-controls';
import { toast } from 'react-toastify';
import swal from '@sweetalert/with-react';
import * as Yup from 'yup';

import api from '~/services/api';

class InstructorsForm extends Component {
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
    data: {},
    isUpdating: false,
    isLoading: true,
    isSubmitted: false
  };

  async componentDidMount() {
    try {
      const {
        match: {
          params: { id }
        }
      } = this.props;

      if (id) {
        const { data } = await api.get(`/instructors/${id}`);

        this.setState({ data });
      }

      this.setState({ isLoading: false });
    } catch (err) {
      toast.error('Erro ao buscar dados do instrutor. :(');
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

      await api.delete(`/instructors/${id}`);

      toast.success('Instrutor excluído com sucesso!');
      history.push('/instructors');
    } catch (err) {
      toast.error('Erro ao excluir instrutor. :(');
      console.error(err);
    }
  };

  render() {
    const { data, isLoading, isUpdating, isSubmitted } = this.state;
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
            {`${isUpdating ? 'Editar' : 'Novo'} instrutor`}
          </Heading>
          <Button
            icon={<LinkPrevious color="brand" />}
            label="Voltar"
            onClick={() => history.push('/instructors')}
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
              name: Yup.string().required('Campo obrigatório')
            })}
            onSubmit={async (values, { setSubmitting }) => {
              this.setState({
                isLoading: true
              });

              try {
                await api.postOrPut('/instructors', id, {
                  values
                });

                toast.success('Instrutor salvo com sucesso!');
                history.push('/instructors');
              } catch (err) {
                toast.error('Erro ao salvar instrutor. :(');
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
                  <FormField label="Nome" error={errors.name}>
                    <TextInput
                      name="name"
                      value={values.name || ''}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField label="CPF" error={errors.doc}>
                    <MaskedInput
                      name="doc"
                      mask={[
                        {
                          length: 3,
                          regexp: /^[0-9]{1,3}$/,
                          placeholder: 'XXX'
                        },
                        { fixed: '.' },
                        {
                          length: 3,
                          regexp: /^[0-9]{1,3}$/,
                          placeholder: 'XXX'
                        },
                        { fixed: '.' },
                        {
                          length: 3,
                          regexp: /^[0-9]{1,3}$/,
                          placeholder: 'XXX'
                        },
                        { fixed: '-' },
                        {
                          length: 2,
                          regexp: /^[0-9]{1,2}$/,
                          placeholder: 'XX'
                        }
                      ]}
                      value={values.doc || ''}
                      onChange={event =>
                        setFieldValue('doc', event.target.value)
                      }
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
                        const deleteInstructor = await swal({
                          title: 'Excluir instrutor?',
                          text: 'Essa ação não poderá ser revertida!',
                          icon: 'warning',
                          buttons: ['Cancelar', 'Excluir']
                        });

                        if (deleteInstructor) this.handleDelete();
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

export default InstructorsForm;

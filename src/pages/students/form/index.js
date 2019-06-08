import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Box, Button, Heading, Tab, Tabs } from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { Spinning } from 'grommet-controls';
import { toast } from 'react-toastify';
import swal from '@sweetalert/with-react';
import * as Yup from 'yup';

import PersonalDataForm from './personalDataForm';
import AddressForm from './addressForm';
import QuizForm from './quizForm';

import api from '~/services/api';

class StudentsForm extends Component {
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
    data: {
      active: true,
      quiz: {}
    },
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
        const [{ data }, { data: dataOptions }] = await Promise.all([
          api.get(`/students/${id}`),
          api.get('/students', { params: { showAll: true } })
        ]);

        const options = dataOptions.filter(o => o.id !== parseInt(id, 10));

        this.setState({ data, options, defaultOptions: options });
      } else {
        const { data: options } = await api.get('/students', {
          params: { showAll: true }
        });

        this.setState({ options, defaultOptions: options });
      }

      this.setState({ isLoading: false });
    } catch (err) {
      toast.error('Erro ao buscar dados do aluno. :(');
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

      await api.delete(`/students/${id}`);

      toast.success('Aluno excluído com sucesso!');
      history.push('/students');
    } catch (err) {
      toast.error('Erro ao excluir aluno. :(');
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

  render() {
    const {
      data,
      isLoading,
      isUpdating,
      isSubmitted,
      options,
      defaultOptions
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
            {`${isUpdating ? 'Editar' : 'Novo'} aluno`}
          </Heading>
          <Button
            icon={<LinkPrevious color="brand" />}
            label="Voltar"
            onClick={() => history.push('/students')}
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
                await api.postOrPut('/students', id, {
                  values
                });

                toast.success('Aluno salvo com sucesso!');
                history.push('/students');
              } catch (err) {
                toast.error('Erro ao salvar aluno. :(');
                console.error(err);
                this.setState({
                  isLoading: false
                });
              }

              setSubmitting();
            }}
          >
            {({ handleSubmit, ...props }) => (
              <form
                onSubmit={event => {
                  event.preventDefault();
                  this.setState({ isSubmitted: true });
                  handleSubmit();
                }}
              >
                <Tabs>
                  <Tab title="Dados pessoais">
                    <PersonalDataForm {...props} />
                  </Tab>
                  <Tab title="Endereço">
                    <AddressForm {...props} />
                  </Tab>
                  <Tab title="Questionário">
                    <QuizForm
                      options={options}
                      defaultOptions={defaultOptions}
                      handleClose={this.handleClose}
                      handleSearch={this.handleSearch}
                      {...props}
                    />
                  </Tab>
                </Tabs>

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
                        const deleteStudent = await swal({
                          title: 'Excluir aluno?',
                          text: 'Essa ação não poderá ser revertida!',
                          icon: 'warning',
                          buttons: ['Cancelar', 'Excluir']
                        });

                        if (deleteStudent) this.handleDelete();
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

export default StudentsForm;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box, Button, Heading, Tab, Tabs,
} from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { Spinning } from 'grommet-controls';
import { toast } from 'react-toastify';
import swal from '@sweetalert/with-react';

import PersonalDataForm from './personalDataForm';
import AddressForm from './addressForm';
import QuizForm from './quizForm';

import api from '~/services/api';

class StudentsForm extends Component {
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
        const { data } = await api.get(`/students/${id}`);

        this.setState({ data, isLoading: false });
      }
    } catch (err) {
      toast.error('Erro ao buscar dados do aluno. :(');
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

      await api.delete(`/students/${id}`);

      toast.success('Aluno excluído com sucesso!');
      history.push('/students');
    } catch (err) {
      toast.error('Erro ao excluir aluno. :(');
      console.error(err);
    }
  };

  render() {
    const {
      data, isLoading, isUpdating, isSubmitted,
    } = this.state;
    const {
      match: {
        params: { id },
      },
      history,
    } = this.props;

    return (
      <Box flex pad="small">
        <Box flex="shrink" pad="small" direction="row" justify="between">
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
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = '* Obrigatório';
              }

              return errors;
            }}
            validateOnBlur={isSubmitted}
            validateOnChange={isSubmitted}
            onSubmit={async (values, { setSubmitting }) => {
              this.setState({
                isLoading: true,
              });

              try {
                await api.postOrPut('/students', id, {
                  values,
                });

                toast.success('Aluno salvo com sucesso!');
                history.push('/students');
              } catch (err) {
                toast.error('Erro ao salvar aluno. :(');
                console.error(err);
                this.setState({
                  isLoading: false,
                });
              }

              setSubmitting();
            }}
          >
            {({ handleSubmit, ...props }) => (
              <form
                onSubmit={(event) => {
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
                    <QuizForm {...props} />
                  </Tab>
                </Tabs>

                <Box tag="footer" margin={{ top: 'medium' }} direction="row" justify="between">
                  <Button type="submit" primary label="Salvar" />
                  {isUpdating && (
                    <Button
                      type="button"
                      color="status-critical"
                      label="Excluir"
                      // onClick={this.handleDelete}
                      onClick={async () => {
                        const deleteUser = await swal({
                          title: 'Excluir aluno?',
                          text: 'Essa ação não poderá ser revertida!',
                          icon: 'warning',
                          buttons: ['Cancelar', 'Excluir'],
                        });

                        if (deleteUser) this.handleDelete();
                      }}
                      // swal("Thanks for your rating!", `You rated us ${value}/3`, "success")
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box, Button, FormField, Heading, TextInput,
} from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { Spinning } from 'grommet-controls';
import { toast } from 'react-toastify';
import swal from '@sweetalert/with-react';
import * as Yup from 'yup';

import api from '~/services/api';

class ProductsForm extends Component {
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
        const { data } = await api.get(`/products/${id}`);

        this.setState({ data });
      }

      this.setState({ isLoading: false });
    } catch (err) {
      toast.error('Erro ao buscar dados do produto. :(');
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

      await api.delete(`/products/${id}`);

      toast.success('Produto excluído com sucesso!');
      history.push('/products');
    } catch (err) {
      toast.error('Erro ao excluir produto. :(');
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
        <Box pad="small" direction="row" justify="between">
          <Heading level={2} margin="none" color="brand">
            {`${isUpdating ? 'Editar' : 'Novo'} produto`}
          </Heading>
          <Button
            icon={<LinkPrevious color="brand" />}
            label="Voltar"
            onClick={() => history.push('/products')}
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
              quantity: Yup.string().required('Campo obrigatório'),
              amount: Yup.string().required('Campo obrigatório'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              this.setState({
                isLoading: true,
              });

              try {
                await api.postOrPut('/products', id, {
                  values,
                });

                toast.success('Produto salvo com sucesso!');
                history.push('/products');
              } catch (err) {
                toast.error('Erro ao salvar produto. :(');
                console.error(err);
                this.setState({
                  isLoading: false,
                });
              }

              setSubmitting();
            }}
          >
            {({
              errors, handleChange, handleSubmit, values,
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
                  <FormField label="Quantidade" error={errors.quantity}>
                    <TextInput
                      name="quantity"
                      value={values.quantity || ''}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField label="Valor unitário" error={errors.amount}>
                    <TextInput name="amount" value={values.amount} onChange={handleChange} />
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
                      const deleteProduct = await swal({
                        title: 'Excluir produto?',
                        text: 'Essa ação não poderá ser revertida!',
                        icon: 'warning',
                        buttons: ['Cancelar', 'Excluir'],
                      });

                      if (deleteProduct) this.handleDelete();
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

export default ProductsForm;

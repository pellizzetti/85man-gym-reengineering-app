import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Box } from 'grommet';

import api from '~/services/api';

class PersonsList extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        personType: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    results: [],
    loading: true,
  };

  async componentDidMount() {
    try {
      const {
        data: { results },
      } = await api.get('/persons');

      console.log(results);

      this.setState({
        results,
        loading: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { match } = this.props;
    const { loading, results } = this.state;
    return (
      <Box flex align="center" justify="center">
        <h3>
          ID:
          {match.params.personType}
          <ul>
            {loading ? <div>Carregando</div> : results.map(ele => <li key={ele.id}>{ele.name}</li>)}
          </ul>
        </h3>
      </Box>
    );
  }
}

export default withRouter(PersonsList);

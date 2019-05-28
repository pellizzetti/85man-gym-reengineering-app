import styled from 'styled-components';
import { getRGBA } from 'grommet/utils/colors';
import { Table } from 'dx-react-grid-grommet';

const StripedTable = styled(Table.Table)`
  & > thead tr {
    font-weight: 500;
    color: ${props => props.theme.global.colors.brand};
  }

  & > tbody tr:nth-of-type(odd) {
    background-color: ${props => getRGBA(props.theme.global.colors.brand, 0.05)};
  }
`;

export default StripedTable;

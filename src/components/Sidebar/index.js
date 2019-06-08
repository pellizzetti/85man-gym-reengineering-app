import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Anchor,
  Box,
  Button,
  Collapsible,
  Layer,
  Menu,
  ResponsiveContext
} from 'grommet';
import {
  Analytics,
  Baby,
  Clock,
  Currency,
  DocumentTime,
  FormClose,
  Group,
  Help,
  Home,
  System,
  Tag,
  Transaction
} from 'grommet-icons';

const List = props => <Box fill tag="ul" {...props} />;

const ListItem = props => (
  <Box
    border={{
      color: 'border',
      size: 'xsmall',
      style: 'outset',
      side: 'bottom'
    }}
    margin="small"
    direction="row"
    align="center"
    {...props}
  />
);

const renderList = history => (
  <List>
    <ListItem
      margin={{
        top: 'small',
        right: 'small',
        bottom: 'none',
        left: 'small'
      }}
    >
      <Anchor
        onClick={() => {
          history.push('/dashboard');
        }}
        icon={<Home />}
        label="Dashboard"
        size="medium"
        margin={{ top: 'small', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
    <ListItem>
      <Group color="brand" />
      <Menu
        label="Cadastro"
        alignSelf="center"
        color="brand"
        items={[
          {
            label: 'Alunos',
            onClick: () => {
              history.push('/students/new');
            }
          },
          {
            label: 'Produtos',
            onClick: () => {
              history.push('/products/new');
            }
          },
          {
            label: 'Instrutores',
            onClick: () => {
              history.push('/instructors/new');
            }
          },
          {
            label: 'Atividades',
            onClick: () => {
              history.push('/activities/new');
            }
          }
        ]}
        margin={{ top: 'none', bottom: 'xsmall' }}
      />
    </ListItem>
    <ListItem>
      <Anchor
        onClick={() => {
          history.push('/students');
        }}
        icon={<Baby />}
        label="Alunos"
        size="medium"
        margin={{ top: 'none', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
    <ListItem>
      <Anchor
        onClick={() => {
          history.push('/enrollments');
        }}
        icon={<DocumentTime />}
        label="Matrículas"
        size="medium"
        margin={{ top: 'none', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
    <ListItem>
      <Anchor
        onClick={() => {}}
        icon={<Clock />}
        label="Horários"
        size="medium"
        margin={{ top: 'none', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
    <ListItem>
      <Anchor
        onClick={() => {}}
        icon={<Transaction />}
        label="Vendas"
        size="medium"
        margin={{ top: 'none', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
    <ListItem>
      <Anchor
        onClick={() => {}}
        icon={<Tag />}
        label="Compras"
        size="medium"
        margin={{ top: 'none', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
    <ListItem>
      <Anchor
        onClick={() => {}}
        icon={<Currency />}
        label="Caixa"
        size="medium"
        margin={{ top: 'none', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
    <ListItem>
      <Anchor
        onClick={() => {}}
        icon={<System />}
        label="Sistema"
        size="medium"
        margin={{ top: 'none', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
    <ListItem>
      <Anchor
        onClick={() => {}}
        icon={<Analytics />}
        label="Relatórios"
        size="medium"
        margin={{ top: 'none', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
    <ListItem>
      <Anchor
        onClick={() => {}}
        icon={<Help />}
        label="Ajuda"
        size="medium"
        margin={{ top: 'none', bottom: 'small' }}
        style={{ fontWeight: 400 }}
      />
    </ListItem>
  </List>
);

const Sidebar = ({ showSidebar, handleSidebarClose, history }) => (
  <ResponsiveContext.Consumer>
    {size =>
      !showSidebar || size !== 'small' ? (
        <Collapsible direction="horizontal" open={showSidebar}>
          <Box
            flex
            width="medium"
            background="light-2"
            elevation="small"
            align="center"
            justify="center"
          >
            {renderList(history)}
          </Box>
        </Collapsible>
      ) : (
        <Layer>
          <Box
            background="light-2"
            tag="header"
            justify="end"
            align="center"
            direction="row"
          >
            <Button icon={<FormClose />} onClick={handleSidebarClose} />
          </Box>
          <Box fill background="light-2" align="center" justify="center">
            {renderList(history)}
          </Box>
        </Layer>
      )
    }
  </ResponsiveContext.Consumer>
);

Sidebar.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  handleSidebarClose: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

export default withRouter(Sidebar);

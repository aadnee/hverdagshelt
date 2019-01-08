import ReactDOM from 'react-dom';
import * as React from 'react';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert } from './widgets';
import { userService } from './services';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

class Menu extends React.Component {
  render() {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <NavLink activeStyle={{ color: 'darkblue' }} exact to="/">
                Hverdagshelt
              </NavLink>
            </td>
            <td>
              <NavLink activeStyle={{ color: 'darkblue' }} to="/users">
                Brukere
              </NavLink>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

class Home extends React.Component {
  render() {
    return <div>Hverdagshelt</div>;
  }
}

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }
  render() {
    return (
      <ul>
        {this.state.users.map(user => (
          <li key={user.email}>
            <NavLink activeStyle={{ color: 'darkblue' }} exact to={'/users/' + user.id}>
              {user.firstName} {user.lastName}
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }

  componentWillMount() {
    userService
      .getUsers()
      .then(users => this.setState({ users: users }))
      .catch(error => Alert.danger(error.message));
  }
}

class UserDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null
    };
  }

  render() {
    if (!this.state.user) return null;

    return (
      <div>
        <ul>
          <li>Fornavn: {this.state.user.firstName}</li>
          <li>Etternavn: {this.state.user.lastName}</li>
          <li>Epost: {this.state.user.email}</li>
          <li>Telefon: {this.state.user.phone}</li>
          <li>Rank: {this.state.user.rank}</li>
          <li>Kommune: {this.state.user.municipalId}</li>
        </ul>
      </div>
    );
  }

  componentWillMount() {
    userService
      .getUser(this.props.match.params.id)
      .then(user => this.setState({ user: user }))
      .catch(error => Alert.danger(error.message));
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route path="/users" component={UserList} />
        <Route exact path="/users/:id" component={UserDetails} />
      </div>
    </HashRouter>,
    root
  );

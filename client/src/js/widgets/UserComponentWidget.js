import * as React from 'react';
import { List, Button } from 'semantic-ui-react';
import { DeleteUserWidget } from './DeleteUserWidget';
import { AdminRegisterWidget } from './AdminRegisterWidget';

export class UserComponentListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.users = [
      {
        id: '2',
        name: 'hallo1',
        email: 'email@e.com',
        phone: '41122142142',
        municipalId: '1'
      },
      {
        id: '1',
        name: 'hallo2',
        email: 'email@a.com',
        phone: '41122142142',
        municipalId: '2'
      }
    ];
  }

  render() {
    return (
      <div>
        <List divided relaxed>
          {this.users.map((user, i) => {
            return <UserComponentListItemWidget key={i} user={this.users[i]} />;
          })}
        </List>
        <AdminRegisterWidget />
      </div>
    );
  }
}

export class UserComponentListItemWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <List.Item>
        <List.Content floated="right">
          <List.Content>
            <DeleteUserWidget user={this.props.user} />
          </List.Content>
        </List.Content>
        <List.Icon name="user" size="large" verticalAlign="middle" />
        <List.Content>
          <List.Header as="a">{this.props.user.name}</List.Header>
          <List.Description as="a">{this.props.user.email}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

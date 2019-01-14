import * as React from 'react';
import { List, Button } from 'semantic-ui-react';
import { DeleteUserWidget } from './DeleteUserWidget';
import { AdminRegisterWidget } from './AdminRegisterWidget';
import { EditUserWidget } from './EditUserWidget';
import { userService } from '../services/UserServices';
import { companyServices } from '../services/CompanyServices';

export class UserComponentListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentWillMount() {
    this.props.user
      ? userService.getUsers().then(res => {
          this.setState({
            users: res.data
          });
        })
      : companyServices.getCompanies().then(res => {
          this.setState({
            users: res.data
          });
        });
  }

  render() {
    return (
      <div>
        <List divided relaxed>
          {this.state.users.map((user, i) => {
            return <UserComponentListItemWidget key={i} user={this.state.users[i]} />;
          })}
        </List>
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
          <Button.Group compact={false}>
            <EditUserWidget user={this.props.user} userEdit />
            <DeleteUserWidget user={this.props.user} userDelete />
          </Button.Group>
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

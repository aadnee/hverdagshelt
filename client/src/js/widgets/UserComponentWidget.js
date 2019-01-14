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
          console.table(this.state.users);
        })
      : companyServices.getCompanies().then(res => {
          this.setState({
            users: res.data
          });
          console.table(this.state.users);
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
    console.log(this.props.user);
    return (
      <List.Item>
        <List.Content floated="right">
          <Button.Group compact={false}>
            {this.props.user ? (
              <EditUserWidget user={this.props.user} userEdit />
            ) : (
              <EditUserWidget user={this.props.user} />
            )}
            {this.props.user ? (
              <DeleteUserWidget user={this.props.user} userDelete />
            ) : (
              <DeleteUserWidget user={this.props.user} />
            )}
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

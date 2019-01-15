import * as React from 'react';
import { List, Button } from 'semantic-ui-react';
import { DeleteUserWidget } from './DeleteUserWidget';
import { AdminRegisterWidget } from './AdminRegisterWidget';
import { EditUserWidget } from './EditUserWidget';
import { userService } from '../services/UserServices';
import { companyService } from '../services/CompanyServices';

export class UserComponentListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentWillMount() {
    this.props.usertype
      ? userService.getUsers().then(res => {
          this.setState({
            users: res.data
          });
          console.table(this.state.users);
        })
      : companyService.getCompanies().then(res => {
          this.setState({
            users: res.data
          });
          console.table(this.state.users);
        });
  }
  handleDelete = id => {
    this.props.usertype
      ? userService.deleteUser(id).then(res => {
          console.log(res);
          this.setState({ users: this.state.users.filter(u => u.id !== id) });
        })
      : companyServices.deleteCompany(id).then(res => {
          console.log(res);
          this.setState({ users: this.state.users.filter(u => u.id !== id) });
        });
  };

  handleEdit = user => {
    console.table(user);
    this.props.usertype
      ? userService.editUser(user.id, user.name, user.email, user.phone, user.municipalId, user.rank).then(res => {
          console.log(res);
          this.setState({ popupMessage: res.message });
          res.success ? this.setState({ popupSuccess: true }) : this.setState({ popupSuccess: false });
          this.setState({ showRegisterModal: true });
        })
      : companyServices.editCompany(user.id, user.name, user.email, user.phone, user.municipalId).then(res => {
          console.log(res);
          this.setState({ popupMessage: res.message });
          res.success ? this.setState({ popupSuccess: true }) : this.setState({ popupSuccess: false });
          this.setState({ showRegisterModal: true });
        });
  };

  render() {
    return (
      <div>
        <List divided relaxed>
          {this.props.usertype
            ? this.state.users.map((user, i) => {
                return (
                  <UserComponentListItemWidget
                    handleDelete={this.handleDelete.bind(this, user.id)}
                    handleEdit={this.handleEdit}
                    usertype
                    key={i}
                    user={this.state.users[i]}
                  />
                );
              })
            : this.state.users.map((user, i) => {
                return (
                  <UserComponentListItemWidget
                    handleDelete={this.handleDelete.bind(this, user.id)}
                    handleEdit={this.handleEdit}
                    key={i}
                    user={user}
                  />
                );
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
            {this.props.usertype ? (
              <EditUserWidget user={this.props.user} handleEdit={this.props.handleEdit} userEdit />
            ) : (
              <EditUserWidget user={this.props.user} handleEdit={this.props.handleEdit} />
            )}
            <DeleteUserWidget handleDelete={this.props.handleDelete} user={this.props.user} />
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

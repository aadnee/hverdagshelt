import * as React from 'react';
import { List, Button, Modal } from 'semantic-ui-react';
import { DeleteUserWidget } from './DeleteUserWidget';
import { AdminRegisterWidget } from './AdminRegisterWidget';
import { EditUserWidget } from './EditUserWidget';
import { userService } from '../services/UserServices';
import { companyService } from '../services/CompanyServices';

export class UserComponentListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      showRegisterModal: false,
      popupMessage: '',
      popupSuccess: ''
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentWillMount() {
    this.props.usertype
      ? userService.getUsers().then(res => {
          this.setState({
            users: res.data
          });
        })
      : companyService.getCompanies().then(res => {
          this.setState({
            users: res.data
          });
        });
  }
  handleDelete = id => {
    this.props.usertype
      ? userService.deleteUser(id).then(res => {
          console.log(res);
          this.setState({ users: this.state.users.filter(u => u.id !== id) });
        })
      : companyService.deleteCompany(id).then(res => {
          console.log(res);
          this.setState({ users: this.state.users.filter(u => u.id !== id) });
        });
  };

  handleEdit = async user => {
    console.table(user);
    return this.props.usertype
      ? userService.editUser(user.id, user.name, user.email, user.phone, user.municipalId, user.rank).then(res => {
          console.log(res);
          this.setState({
            popupMessage: res.message.no,
            popupSuccess: res.success,
            showRegisterModal: true
          });
          let oldUser = null;
          if (res.success) {
            this.state.users.find((u, i) => {
              user.id === u.id ? (oldUser = i) : null;
            });
            console.log(oldUser);
            this.state.users[oldUser] = user;
            this.forceUpdate();
          }
          return res.success;
        })
      : companyService.editCompany(user.id, user.name, user.email, user.phone, user.municipalId).then(res => {
          console.log(res);
          this.setState({
            popupMessage: res.message.no,
            popupSuccess: res.success,
            showRegisterModal: true
          });
          let oldUser = null;
          if (res.success) {
            this.state.users.find((u, i) => {
              user.id === u.id ? (oldUser = i) : null;
            });
            console.log(oldUser);
            this.state.users[oldUser] = user;
            this.forceUpdate();
          }
          return res.success;
        });
  };
  closeModals = () => {
    this.setState({
      showRegisterModal: false
    });
  };

  handleRegister = async newUser => {
    //USERSERICE -> request cookie
    return (await this.props.usertype)
      ? userService.register(newUser.name, newUser.email, newUser.phone, newUser.municipalId).then(res => {
          let newArrayUsers = this.state.users;
          newArrayUsers.push(newUser);
          res.success ? this.setState({ users: newArrayUsers }) : null;
          return res.success;
        })
      : companyService.addCompany(newUser.name, newUser.email, newUser.phone, newUser.municipalId).then(res => {
          console.log(res);
          let newArrayUsers = this.state.users;
          newArrayUsers.push(newUser);
          res.success ? this.setState({ users: newArrayUsers }) : null;
          return res.success;
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
                    user={user}
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
        {this.props.usertype ? (
          <AdminRegisterWidget handleRegister={this.handleRegister} user />
        ) : (
          <AdminRegisterWidget handleRegister={this.handleRegister} />
        )}
        <Modal size={'tiny'} open={this.state.showRegisterModal}>
          <Modal.Header>Registreringsstatus: {this.state.popupSuccess ? 'Suksess' : 'Error'}</Modal.Header>
          <Modal.Content>
            <p>{this.state.popupMessage}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button icon="check" content="Ok" onClick={this.closeModals} />
          </Modal.Actions>
        </Modal>
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
          <List.Header>{this.props.user.name}</List.Header>
          <List.Description>{this.props.user.email}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

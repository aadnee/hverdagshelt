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
          this.setState({ popupMessage: res.message.no });
          res.success ? this.setState({ popupSuccess: true }) : this.setState({ popupSuccess: false });
          this.setState({ showRegisterModal: true });
          let oldUser = 0;
          this.state.users.find((u, i) => {
            (user.id = u.id) ? (oldUser = i) : null;
          });
          console.log(oldUser);
          this.state.users[oldUser] = user;
          this.forceUpdate();
        })
      : companyService.editCompany(user.id, user.name, user.email, user.phone, user.municipalId).then(res => {
          console.log(res);
          this.setState({ popupMessage: res.message.no });
          res.success ? this.setState({ popupSuccess: true }) : this.setState({ popupSuccess: false });
          this.setState({ showRegisterModal: true });
          let oldUser = 0;
          this.state.users.find((u, i) => {
            user.id = u.id ? (oldUser = i) : null;
          });
          console.log(oldUser);
          this.state.users[oldUser] = user;
          this.forceUpdate();
        });
  };
  closeModals = () => {
    this.setState({
      showRegisterModal: false
    });
  };

  handleRegister = newUser => {
    //USERSERICE -> request cookie
    this.props.user
      ? userService.register(newUser.name, newUser.email, newUser.phone, newUser.municipalId).then(res => {
          this.setState({ popupMessage: res.message.no });
          res.success ? this.setState({ popupSuccess: true }) : this.setState({ popupSuccess: false });
          this.setState({ showRegisterModal: true });
          return res.success;
        })
      : companyService.addCompany(newUser.name, newUser.email, newUser.phone, newUser.municipalId).then(res => {
          console.log(res);
          this.setState({ popupMessage: res.message.no });
          res.success ? this.setState({ popupSuccess: true }) : this.setState({ popupSuccess: false });
          this.setState({ showRegisterModal: true });
          return res.success;
        });
    return false;
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
        <AdminRegisterWidget handleRegister={this.handleRegister} user />
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
          <List.Header as="a">{this.props.user.name}</List.Header>
          <List.Description as="a">{this.props.user.email}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

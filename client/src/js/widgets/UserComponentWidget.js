import * as React from 'react';
import { List, Button, Modal } from 'semantic-ui-react';
import { DeleteUserWidget } from './DeleteUserWidget';
import { AdminRegisterWidget } from './AdminRegisterWidget';
import { EditUserWidget } from './EditUserWidget';
import { userService } from '../services/UserServices';
import { companyService } from '../services/CompanyServices';
import { toast } from 'react-toastify';
import { MessageWidget } from './MessageWidget';

export class UserComponentListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: null,
      selectedName: null,
      regModalOpen: false,
      editModalOpen: false,
      deleteModalOpen: false,
      popupMessage: '',
      popupSuccess: ''
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.close = this.close.bind(this);
  }

  setUser = (user, modal) => {
    this.setState({ user: user, selectedName: user.name }, () => {
      this.open(modal);
    });
  };

  close = modal => {
    this.setState({ [modal]: false });
  };
  open = modal => {
    this.setState({ [modal]: true });
  };

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
  handleDelete = user => {
    this.props.usertype
      ? userService.deleteUser(user.id).then(res => {
          console.log(res);
          if (res.success) {
            toast.success(res.message.no);
            this.setState({ users: this.state.users.filter(u => u.id !== user.id) });
            this.close('deleteModalOpen');
          } else {
            toast.error(res.message.no);
          }
        })
      : companyService.deleteCompany(user.id).then(res => {
          console.log(res);
          if (res.success) {
            toast.success(res.message.no);
            this.setState({ users: this.state.users.filter(u => u.id !== user.id) });
            this.close('deleteModalOpen');
          } else {
            toast.error(res.message.no);
          }
        });
  };

  handleEdit = user => {
    console.log(user);
    if (this.props.usertype) {
      console.log('d');
      userService.editUser(user.id, user.name, user.email, user.phone, user.municipalId, user.rank).then(res => {
        console.log(res);
        if (res.success) {
          this.close('editModalOpen');
          let oldUser = null;
          this.state.users.find((u, i) => {
            user.id === u.id ? (oldUser = i) : null;
          });
          this.state.users[oldUser] = user;
          toast.success(res.message.no);
          this.forceUpdate();
        } else {
          toast.error(res.message.no);
        }
      });
    } else {
      companyService.editCompany(user.id, user.name, user.email, user.phone, user.municipalId).then(res => {
        console.log(res);
        if (res.success) {
          this.close('editModalOpen');

          let oldUser = null;

          this.state.users.find((u, i) => {
            user.id === u.id ? (oldUser = i) : null;
          });
          console.log(oldUser);
          this.state.users[oldUser] = user;
          toast.success(res.message.no);

          this.forceUpdate();
        } else {
          toast.error(res.message.no);
        }
      });
    }
  };

  handleRegister = newUser => {
    //USERSERICE -> request cookie
    this.props.usertype
      ? userService.register(newUser.name, newUser.email, newUser.phone, newUser.municipalId).then(res => {
          console.log(res);

          if (res.success) {
            this.close('regModalOpen');
            let newArrayUsers = this.state.users;
            newArrayUsers.push(newUser);
            this.setState({ users: newArrayUsers });
            toast.success(res.message.no);
          } else {
            toast.error(res.message.no);
          }
        })
      : companyService.addCompany(newUser.name, newUser.email, newUser.phone, newUser.municipalId).then(res => {
          console.log(res);
          if (res.success) {
            this.close('regModalOpen');

            let newArrayUsers = this.state.users;
            newArrayUsers.push(newUser);
            this.setState({ users: newArrayUsers });
            toast.success(res.message.no);
          } else {
            toast.error(res.message.no);
          }
        });
  };

  render() {
    return (
      <div>
        <List divided relaxed>
          {this.state.users.map((user, i) => (
            <List.Item key={i}>
              <List.Content floated="right">
                <Button.Group compact={false}>
                  <Button color="green" onClick={this.setUser.bind(this, user, 'editModalOpen')}>
                    Edit
                  </Button>
                  <Button color="red" onClick={this.setUser.bind(this, user, 'deleteModalOpen')} inverted>
                    Slett
                  </Button>
                </Button.Group>
              </List.Content>
              <List.Icon name="user" size="large" verticalAlign="middle" />
              <List.Content>
                <List.Header>{user.name}</List.Header>
                <List.Description>{user.email}</List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>

        <MessageWidget
          size={'tiny'}
          open={this.state.deleteModalOpen}
          title={'Sletting av ' + this.state.selectedName}
          message={'Er du sikker på at du vil slette ' + this.state.selectedName}
          customFunc={this.handleDelete.bind(this, this.state.user)}
          callback={this.close}
          closeParam={'deleteModalOpen'}
        />
        <Modal
          onClose={() => this.close('editModalOpen')}
          onOpen={() => this.open('editModalOpen')}
          open={this.state.editModalOpen}
          closeIcon
        >
          <Modal.Header>Redigere Bruker</Modal.Header>
          <Modal.Content>
            {this.props.usertype ? (
              <EditUserWidget
                user={this.state.user}
                handleEdit={this.handleEdit}
                close={this.close.bind(this, 'editModalOpen')}
                userEdit={this.props.usertype}
              />
            ) : (
              <EditUserWidget
                user={this.state.user}
                handleEdit={this.handleEdit}
                close={this.close.bind(this, 'editModalOpen')}
              />
            )}
          </Modal.Content>
        </Modal>
        <Modal
          onClose={() => this.close('regModalOpen')}
          onOpen={() => this.open('regModalOpen')}
          open={this.state.regModalOpen}
          trigger={<Button icon="add" inverted color="green" />}
          closeIcon
        >
          <Modal.Header>
            <h1>{this.props.user ? 'Registrer bruker' : 'Registrer bedrift'}</h1>
          </Modal.Header>
          <Modal.Content>
            {this.props.usertype ? (
              <AdminRegisterWidget
                user
                handleRegister={this.handleRegister}
                close={this.close.bind(this, 'regModalOpen')}
              />
            ) : (
              <AdminRegisterWidget handleRegister={this.handleRegister} close={this.close.bind(this, 'regModalOpen')} />
            )}
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

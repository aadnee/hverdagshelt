import * as React from 'react';
import { List, Button, Modal, Input } from 'semantic-ui-react';
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
      allUsers: [],
      user: null,
      selectedName: null,
      regModalOpen: false,
      editModalOpen: false,
      deleteModalOpen: false,
      popupMessage: '',
      popupSuccess: '',
      searchValue: ''
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
            users: res.data,
            allUsers: res.data
          });
        })
      : companyService.getCompanies().then(res => {
          this.setState({
            users: res.data,
            allUsers: res.data
          });
        });
  }

  handleDelete = user => {
    this.props.usertype
      ? userService.deleteUser(user.id).then(res => {
          if (res.success) {
            toast.success(res.message.no);

            this.setState({
              users: this.state.users.filter(u => u.id !== user.id),
              allUsers: this.state.users.filter(u => u.id !== user.id)
            });
            this.close('deleteModalOpen');
          } else {
            toast.error(res.message.no);
          }
        })
      : companyService.deleteCompany(user.id).then(res => {
          if (res.success) {
            toast.success(res.message.no);
            this.setState({
              users: this.state.users.filter(u => u.id !== user.id),
              allUsers: this.state.users.filter(u => u.id !== user.id)
            });
            this.close('deleteModalOpen');
          } else {
            toast.error(res.message.no);
          }
        });
  };

  handleEdit = user => {
    if (this.props.usertype) {
      userService.editUser(user.id, user.name, user.email, user.phone, user.municipalId, user.rank).then(res => {
        if (res.success) {
          //Find old user

          this.close('editModalOpen');
          let oldUser = null;
          this.state.users.find((u, i) => {
            user.id === u.id ? (oldUser = i) : null;
          });
          this.state.users[oldUser] = user;
          this.state.allUsers[oldUser] = user;

          toast.success(res.message.no);
          this.forceUpdate();
        } else {
          toast.error(res.message.no);
        }
      });
    } else {
      companyService.editCompany(user.id, user.name, user.email, user.phone, user.municipalId).then(res => {
        if (res.success) {
          this.close('editModalOpen');
          //Find old user
          let oldUser = null;
          this.state.users.find((u, i) => {
            user.id === u.id ? (oldUser = i) : null;
          });
          this.state.users[oldUser] = user;
          this.state.allUsers[oldUser] = user;
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
          if (res.success) {
            this.close('regModalOpen');
            let newArrayUsers = this.state.users;
            newArrayUsers.push(newUser);
            this.setState({ users: newArrayUsers, allUsers: newArrayUsers });
            toast.success(res.message.no);
          } else {
            toast.error(res.message.no);
          }
        })
      : companyService.addCompany(newUser.name, newUser.email, newUser.phone, newUser.municipalId).then(res => {
          if (res.success) {
            this.close('regModalOpen');

            let newArrayUsers = this.state.users;
            newArrayUsers.push(newUser);
            this.setState({ users: newArrayUsers, allUsers: newArrayUsers });
            toast.success(res.message.no);
          } else {
            toast.error(res.message.no);
          }
        });
  };

  render() {
    return (
      <div>
        <Input
          fluid
          icon="search"
          placeholder="Search..."
          value={this.state.searchValue}
          onChange={(event, data) => {
            this.setState({ searchValue: data.value }, () => {
              let newArr = [];

              this.state.allUsers.map(user => {
                if (user.name.toLowerCase().includes(this.state.searchValue)) {
                  newArr.push(user);
                } else {
                  return null;
                }
              });
              this.setState({ users: newArr });
            });
          }}
        />
        <List divided relaxed>
          {this.state.users.map((user, i) => (
            <List.Item key={i}>
              <List.Content floated="right">
                <Button.Group compact={false}>
                  <Button color="green" onClick={this.setUser.bind(this, user, 'editModalOpen')}>
                    Endre
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
          <Modal.Header>{this.props.usertype ? 'Rediger bruker' : 'Rediger Bedrift'}</Modal.Header>
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
            <h1>{this.props.usertype ? 'Registrer bruker' : 'Registrer bedrift'}</h1>
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

import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { userService } from '../services/UserServices';
import { companyServices } from '../services/CompanyServices';

export class DeleteUserWidget extends Component {
  state = { open: false };
  show = size => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });
  handle = () => {
    this.close();
    this.props.handleDelete(this.props.user.id);
  };

  render() {
    return <div />;
  }
}

import React, { Component } from 'react';
import { userService } from '../services/UserServices';

export class EditUserWidget extends Component {
  constructor(props) {
    super(props);
  }
  close = () => this.setState({ open: false });
  handleDelete = () => {
    console.log('dd');
    userService.editUser(this.props.id).then(res => console.log(res));
    this.close();
  };
}

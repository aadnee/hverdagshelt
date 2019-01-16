import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Modal,
  Segment,
  TextArea
} from 'semantic-ui-react';

export class MessageWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      modalMessage: ''
    };
  }

  customFunc() {
    this.props.customFunc ? this.props.customFunc() : null;
    this.close();
    this.props.callback ? this.props.callback() : null;
  }

  show = () => () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  componentWillReceiveProps(props) {
    this.setState({ open: props.modalOpen, modalMessage: props.modalMessage });
  }

  render() {
    return (
      <Modal size={this.props.size} open={this.state.open} onClose={this.close}>
        <Modal.Header>Varselinnsendingsstatus</Modal.Header>
        <Modal.Content>
          <p>{this.state.modalMessage}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button icon="checkmark" labelPosition="right" content="OK" onClick={() => this.customFunc()} />
        </Modal.Actions>
      </Modal>
    );
  }
}

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
      open: false
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
    this.setState({ open: props.open });
  }

  render() {
    return (
      <Modal size={this.props.size} open={this.state.open} onClose={this.close}>
        <Modal.Header>{this.props.title}</Modal.Header>
        <Modal.Content>
          <p>{this.props.message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.close}>
            Nei
          </Button>
          <Button positive icon="checkmark" labelPosition="right" content="Ja" onClick={() => this.customFunc()} />
        </Modal.Actions>
      </Modal>
    );
  }
}

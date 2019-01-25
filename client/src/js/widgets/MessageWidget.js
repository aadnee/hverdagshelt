import React from 'react';

import { Button, Modal, Icon } from 'semantic-ui-react';

export class MessageWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      closeParam: this.props.closeParam ? this.props.closeParam : ''
    };
  }

  customFunc() {
    this.props.customFunc ? this.props.customFunc() : null;
    this.close();
    //this.props.callback ? this.props.callback() : null;
  }

  show = () => () => this.setState({ open: true });
  close = () => {
    this.setState({ open: false });
    this.props.callback(this.state.closeParam);
  };

  componentWillReceiveProps(props) {
    this.setState({ open: props.open });
  }

  render() {
    return (
      <Modal size={this.props.size} open={this.state.open} onOpen={this.show} onClose={this.close}>
        <Modal.Header>{this.props.title}</Modal.Header>
        <Modal.Content>
          <p>{this.props.message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button inverted color="blue" onClick={this.close}>
            <Icon name="remove" />
            Nei
          </Button>
          <Button color="blue" icon="checkmark" labelPosition="right" content="Ja" onClick={() => this.customFunc()} />
        </Modal.Actions>
      </Modal>
    );
  }
}

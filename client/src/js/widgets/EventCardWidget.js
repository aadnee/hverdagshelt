import React from 'react';
import { Card, Button } from 'semantic-ui-react';

export class EventCardWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card fluid>
        <Card.Content header={this.props.header} />
        <Card.Content description={this.props.description} />
        <Card.Content extra>
          <Button onClick={this.props.deleteEvent} content={'Fjern event'} floated={'right'} negative />
          <Button content={'Rediger event'} floated={'right'} positive />
        </Card.Content>
      </Card>
    );
  }
}

import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import { ShowInMapWidget } from './ShowInMapWidget';

export class EventCardWidget extends React.Component {
  constructor(props) {
    super(props);
  }
  /*
            <ShowInMapWidget mapOnly latlng={this.props.latlng} />
            */
  render() {
    return (
      <Card fluid>
        <Card.Content header={this.props.header} />
        <Card.Content description={this.props.description} />
        <Card.Content extra>
          <Button onClick={this.props.deleteEvent} content={'Fjern event'} floated={'right'} inverted color="blue" />
          <Button onClick={this.props.editEvent} content={'Rediger event'} floated={'right'} color="blue" />
        </Card.Content>
      </Card>
    );
  }
}

import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';

//import {} from './';

export class TicketWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //let warning = this.props;
    let warning = this.props;
    return (
      <Panel bsStyle="primary">
        <Panel.Heading>
          <Panel.Title componentClass="h3">
            <NavLink to="/widget2">Varsel #{warning.id}</NavLink>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Grid>
            <Row className="show-grid">
              <Col xs={12} md={8}>
                <p>Description</p>
                <p>
                  <Button bsStyle="primary">Button</Button>

                  <Button bsStyle="default">Button</Button>
                </p>
              </Col>
              <Col xs={6} md={4}>
                <Image src="/img/thumbnaildiv.png" alt="242x200" />
                <h3>Thumbnail label</h3>
              </Col>
            </Row>
          </Grid>
        </Panel.Body>
      </Panel>
    );
  }
}

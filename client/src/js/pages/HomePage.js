import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Header, Divider, Segment } from 'semantic-ui-react';

import { SidebarWidget } from './../widgets/SidebarWidget';
import { MapWidget } from './../widgets/MapWidget';
import { TicketFormWidget } from './../widgets/TicketFormWidget';
import { NewsFeedWidget } from './../widgets/NewsFeedWidget';

export class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  callback() {}

  render() {
    return (
      <Container>
        <Segment basic>
          <Grid>
            <Grid.Row columns={2} only="computer">
              <Grid.Column width={10}>
                <MapWidget />
              </Grid.Column>
              <Grid.Column width={6} only="computer">
                <Header as="h5">Nyhetsstrøm</Header>
                <Segment basic>
                  <NewsFeedWidget newsOnly />
                </Segment>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={1} only="mobile tablet">
              <Grid.Column colSpan={2}>
                <MapWidget modal callback={this.callback} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    );
  }
}

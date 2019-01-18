import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Header, Divider, Segment, Tab } from 'semantic-ui-react';

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
    const panes = [
      {
        menuItem: 'Nyhetsstrøm',
        render: () => (
          <Tab.Pane className="frontPageFeedTab">
            <NewsFeedWidget newsOnly />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Arrangementer i Trondheim',
        render: () => <Tab.Pane className="frontPageFeedTab">Eventstrøm</Tab.Pane>
      }
    ];

    return (
      <Container className="homePageContainer">
        <Segment basic className="mapGrid">
          <Grid className="mapGrid">
            <Grid.Row columns={2} only="computer" className="mapRow">
              <Grid.Column width={10} className="mapRow">
                <MapWidget />
              </Grid.Column>
              <Grid.Column width={6} only="computer" className="frontPageFeed">
                <Tab menu={{ text: true, secondary: true, pointing: true, color: 'blue' }} panes={panes} />
                <Divider hidden />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={1} only="mobile tablet" className="mapRow">
              <Grid.Column colSpan={2} className="mapGrid">
                <MapWidget modal callback={this.callback} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    );
  }
}

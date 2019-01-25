import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Container, Grid, Segment, Divider, Icon } from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MapWidget } from '../widgets/MapWidget';
import { ticketService } from '../services/TicketServices';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Consumer } from '../context';

export class UserReportTicketPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latlng: [null, null],
      address: null,
      subregion: ''
    };
    this.callback = this.callback.bind(this);
    this.setupClick = this.setupClick.bind(this);
  }

  setupClick(address) {
    this.mapWidget.state.searchControl._setupClick();
    this.mapWidget.state.searchControl._input.value = address;
  }

  callback(latlng, address, subregion) {
    this.setState({ latlng: latlng, address: address, subregion: subregion });
  }

  callbackFake() {}

  render() {
    return (
      <Container className="homePageContainer">
        <Segment basic className="mapGrid">
          <Grid className="mapGrid">
            <Grid.Row columns={2} only="computer" className="mapRow">
              <Grid.Column width={10} className="mapRow">
                <MapWidget
                  onRef={ref => (this.mapWidget = ref)}
                  locate
                  callback={this.callback}
                  searchControl
                  ticket
                  submit={Consumer._currentValue.ticketSubmit}
                />
              </Grid.Column>
              <Grid.Column width={6} only="computer" className="frontPageFeed">
                <Divider hidden />
                <Divider horizontal>
                  <Header as="h5">
                    <Icon name="bullhorn" />
                    Varselinnmelding
                  </Header>
                </Divider>
                <TicketFormWidget
                  borderless
                  latlng={this.state.latlng}
                  address={this.state.address}
                  subregion={this.state.subregion}
                  submit={Consumer._currentValue.ticketSubmit}
                  setupClick={this.setupClick}
                />
                <Divider hidden />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={1} only="mobile tablet" className="mapRow">
              <Grid.Column colSpan={2} className="mapGrid">
                <MapWidget modal locate submit={Consumer._currentValue.ticketSubmit} callback={this.callbackFake} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    );
  }
}

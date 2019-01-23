import React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Header, Container, Grid, Segment, Divider, Icon, Button} from 'semantic-ui-react';
import {RegisterEventWidget} from '../widgets/RegisterEventWidget';
import {MapWidget} from '../widgets/MapWidget';
import {ticketService} from '../services/TicketServices';
import {eventService} from '../services/EventServices';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify';
import {Consumer} from '../context';
import {TicketFormWidget} from "../widgets/TicketFormWidget";
import moment from "moment";

export class EmployeeRegisterEventPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latlng: [null, null],
      address: null,
      areaToggle: false,
      area: [],
      placedMarker: false
    };
    this.callbackPoint = this.callbackPoint.bind(this);
    this.callbackArea = this.callbackArea.bind(this);
    this.submit = this.submit.bind(this);
    this.areaToggler = this.areaToggler.bind(this);
    this.placedMarker = this.placedMarker.bind(this);
  }

  callbackPoint(latlng, address) {
    this.setState({area: [latlng], address: address});
  }

  callbackArea(area, address){
    this.setState({area: area, address: address});
  }

  areaToggler(){
    this.setState({areaToggle: !this.state.areaToggle});
  }

  placedMarker(markerPlaced){
    this.setState({placedMarker: markerPlaced})
  }

  callbackFake() {
  }

  submit = (title, description, start, end, municipalId, url) => {
    console.log(this.state);
    //lat, lon  is fetched from the map

    if (!title || !description || !this.state.area || !municipalId) {
      toast.error('Vennligst fyll ut alle felt', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      eventService
          .addEvent(title, description, JSON.stringify(this.state.area), this.state.address, start, end, municipalId, url)
          .then(res => {
            console.log(res);
            if (res.success) {
              toast.success(res.message.no, {
                position: toast.POSITION.TOP_RIGHT
              });
              Consumer._currentValue.history.push({pathname: '/events'});
            } else {
              toast.error(res.message.no, {
                position: toast.POSITION.TOP_RIGHT
              });
            }
            console.log(res);
          });
    }
  };

  render() {
    return (
        <Container className="homePageContainer">
          <Segment basic className="mapGrid">
            <Grid className="mapGrid">
              <Grid.Row columns={2} only="computer" className="mapRow">
                <Grid.Column width={10} className="mapRow">
                  <MapWidget onRef={ref => (this.mapWidget = ref)} callbackPoint={this.callbackPoint} callbackArea={this.callbackArea} areaToggle={this.areaToggler} submit={this.submit} placedMarker={this.placedMarker}/>
                </Grid.Column>
                <Grid.Column width={6} only="computer" className="frontPageFeed">
                  <Divider hidden/>
                  <Divider horizontal>
                    <Header as='h5'>
                      <Icon name='bullhorn'/>
                      Legg til arrangement
                    </Header>
                  </Divider>
                  <Button.Group>
                    <Button toggle active={!this.state.areaToggle} onClick={() => this.mapWidget.areaToggler()}>
                      Punkt
                    </Button>
                    <Button.Or text="&harr;" />
                    <Button toggle active={this.state.areaToggle} onClick={() => this.mapWidget.areaToggler()}>
                      Område
                    </Button>
                  </Button.Group>
                  {this.state.areaToggle ? (
                      <>
                        <Button icon="undo" disabled={!this.state.area.length > 0} onClick={() => this.mapWidget.undoArea()} />
                        <Button icon="trash alternate" disabled={!this.state.area.length > 0} onClick={() => this.mapWidget.clear()} />
                      </>
                  ) : null}
                  {!this.state.areaToggle ? (
                      <>
                        <Button
                            icon="trash alternate"
                            disabled={!this.state.placedMarker}
                            onClick={() => this.mapWidget.removeMarker()}
                        />
                      </>) : null}
                      <Divider hidden/>
                  <RegisterEventWidget
                      borderless
                      latlng={this.state.latlng}
                      address={this.state.address}
                      submit={this.submit}
                  />
                  <Divider hidden/>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={1} only="mobile tablet">
                <Grid.Column colSpan={2}>
                  <MapWidget modal event submit={this.submit} callback={this.callbackFake}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Container>
    );
  }

}

import React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Container, Grid, Header, Divider, Segment, Tab} from 'semantic-ui-react';
import L, {LatLng} from 'leaflet'


import {SidebarWidget} from './../widgets/SidebarWidget';
import {MapWidget} from './../widgets/MapWidget';
import {TicketFormWidget} from './../widgets/TicketFormWidget';
import {NewsFeedWidget} from './../widgets/NewsFeedWidget';
import {EventFeedWidget} from './../widgets/EventFeedWidget';
import {newsService} from './../services/NewsServices';

import {Consumer} from './../context';
import {municipalService} from "../services/MunicipalServices";
import {categoryService} from "../services/CategoryServices";
import {eventService} from "../services/EventServices";

export class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      events: [],
      newsMarkers: [],
      eventMarkers: [],
      eventPolys: []
    };
    this.yellowMarker = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    this.purpleMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  callback() {
  }

  getNews() {
    newsService.getNews()
        .then((res) => this.setState({news: res.data}));
  }

  getEvents() {
    eventService.getEvents()
        .then(res => this.setState({events: res.data}));
  }

  componentWillMount() {
    this.getNews();
    this.getEvents();
  }

  placeMarkers() {
    this.state.news.map((newscase) => {
      if (newscase.municipalId === 1) {
        let popup = (`<p><b>${newscase.title}</b><br/>Addresse: ${newscase.address}</p>`);
        let newsMarker = L.marker([newscase.lat, newscase.lon], {icon: this.yellowMarker})
            .bindPopup(popup);
        this.mapRef.state.map.addLayer(newsMarker);
        this.state.newsMarkers.push(newsMarker);
      }
    });
    this.state.events.map((event) => {
      if (event.municipalId === 1) {
        const area = JSON.parse(event.area).map(cord => {
          return [cord.lat, cord.lng];
        });
        let popup = (`<p><b>${event.title}</b><br/>Addresse: ${event.address}</p>`);
        if (area.length > 1) {
          let poly = L.polygon(area, {color: 'purple'}).bindPopup(popup);
          this.mapRef.state.map.addLayer(poly);
          this.state.eventPolys.push(poly);
        } else {
          let eventMarker = L.marker(area, {icon: this.purpleMarker})
              .bindPopup(popup);
          this.mapRef.state.map.addLayer(eventMarker);
          this.state.eventMarkers.push(eventMarker);
        }
      }
    })
  }

  render() {
    let panes = [
      {
        menuItem: 'Nyheter i Trondheim',
        render: () => (
            <Tab.Pane className="frontPageFeedTab">
              <NewsFeedWidget onRef={ref => this.newsFeedRef = ref} newsOnly frontpage/>
            </Tab.Pane>
        )
      },
      {
        menuItem: 'Arrangementer i Trondheim',
        render: () => (
            <Tab.Pane className="frontPageFeedTab">
              <EventFeedWidget onRef={ref => this.eventFeedRef = ref} newsOnly/>
            </Tab.Pane>
        )
      }
    ];

    return (
        <Container className="homePageContainer">
          <Segment basic className="mapGrid">
            <Grid className="mapGrid">
              <Grid.Row columns={2} only="computer" className="mapRow">
                <Grid.Column width={10} className="mapRow">
                  <MapWidget modal onRef={ref => this.mapRef = ref} searchControl openSearch
                             submit={Consumer._currentValue.ticketSubmit}/>
                  {this.placeMarkers()}
                </Grid.Column>
                <Grid.Column width={6} only="computer" className="frontPageFeed">
                  <Tab menu={{text: true, secondary: true, pointing: true, color: 'blue'}} panes={panes}/>
                  <Divider hidden/>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={1} only="mobile tablet" className="mapRow">
                <Grid.Column colSpan={2} className="mapGrid">
                  <MapWidget modal callback={this.callback} submit={Consumer._currentValue.ticketSubmit}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Container>
    );
  }
}

import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import L from 'leaflet';
import * as ELG from 'esri-leaflet-geocoder';
import 'esri-leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Button, Icon, Modal, Container } from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { toast } from 'react-toastify';
import { Consumer } from '../context';

//import {} from './';

export class MapWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 63.430478482010294,
      lng: 10.395047769353868,
      zoom: 13,
      placedMarker: false,
      markerPos: [null, null],
      map: null,
      marker: null,
      subregion: '',
      userPosMarker: null,
      userPos: [null, null],
      foundPos: false,
      userInfo: null,
      area: [],
      counter: 0,
      poly: null,
      areaToggle: false,
      info: null,
      reverseSearch: null,
      reverseSearchRes: null,
      searchControl: null,
      loggedIn: Consumer._currentValue.user ? true : false,
      userRank: Consumer._currentValue.user ? Consumer._currentValue.user.rank : -1
    };
    this.mapRef = React.createRef();
    this.markerRef = React.createRef();
    this.userMarkerPosRef = React.createRef();
    this.greenIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(undefined);
    }
  }

  componentDidMount() {
    let reverseSearch = new ELG.ReverseGeocode();
    let map = this.mapRef.current.leafletElement;
    let self = this;
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    if (this.props.locate) {
      map
        .locate({ setView: true, maxZoom: 15, enableHighAccuracy: true })
        .on('locationfound', function(e) {
          if (e.accuracy < 100) {
            reverseSearch.latlng(e.latlng).run(function(error, result) {
              self.setState({
                userInfo: result.address.Address + ', ' + result.address.Subregion,
                userPos: [e.latitude, e.longitude],
                foundPos: true
              });
              if (self.props.callbackPoint) {
                self.props.callbackPoint(e.latlng, result.address.Address + ', ' + result.address.Subregion);
              }
              if (self.props.callback) {
                self.props.callback(
                  e.latlng,
                  result.address.Address + ', ' + result.address.Subregion,
                  result.address.Subregion
                );
              }
            });
          }
        })
        .on('locationerror', function(e) {
          self.setState({ foundPos: false });
        });
    }

    if (this.props.searchControl) {
      let arcgisOnline = new ELG.ArcgisOnlineProvider({ countries: ['NO'] });
      const searchControl = new ELG.Geosearch({
        providers: [arcgisOnline],
        allowMultipleResults: false,
        useMapBounds: false,
        expanded: !!this.props.openSearch,
        collapseAfterResult: !this.props.openSearch,
        position: 'topright',
        placeholder: 'Søk etter steder eller adresser'
      }).addTo(map);
      searchControl.on('results', function(data) {
        if (data.results.length < 1) {
          toast.warn('Ingen resultater');
        } else {
          self.handleClick(data.results[0]);
        }
      });
      self.setState({ searchControl: searchControl });
    }
    this.setState({ map: map, reverseSearch: reverseSearch });

    setTimeout(() => {
      if (!this.state.placedMarker && this.props.homepage) {
        this.goToast('bottom-left');
      }
    }, 1000);
  }

  goToast(pos) {
    toast.info(
      this.state.loggedIn ? (
        'Trykk på kartet for å melde inn en sak'
      ) : (
        <>
          <NavLink to={'/login'} style={{ color: 'white', textDecoration: 'underline' }}>
            <b>Logg inn</b>
          </NavLink>{' '}
          eller{' '}
          <NavLink to={'/register'} style={{ color: 'white', textDecoration: 'underline' }}>
            <b>registrer deg</b>
          </NavLink>{' '}
          for å melde en sak
        </>
      ),
      {
        position: pos,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
      }
    );
  }

  render() {
    let pos = [this.state.lat, this.state.lng];
    return (
      <div>
        {this.props.event ? (
          <>
            <Button.Group>
              <Button toggle active={!this.state.areaToggle} onClick={() => this.areaToggler()}>
                Punkt
              </Button>
              <Button.Or text="&harr;" />
              <Button toggle active={this.state.areaToggle} onClick={() => this.areaToggler()}>
                Område
              </Button>
            </Button.Group>
            {this.state.areaToggle ? (
              <>
                <Button icon="undo" disabled={!this.state.area.length > 0} onClick={() => this.undoArea()} />
                <Button icon="trash alternate" disabled={!this.state.area.length > 0} onClick={() => this.clear()} />
              </>
            ) : null}
            {!this.state.areaToggle ? (
              <>
                <Button
                  icon="trash alternate"
                  disabled={!this.state.placedMarker}
                  onClick={() => this.removeMarker()}
                />
              </>
            ) : null}
          </>
        ) : null}
        <Map
          ref={this.mapRef}
          center={pos}
          zoom={this.state.zoom}
          onClick={this.handleClick}
          zoomControl={false}
          maxZoom={19}
        >
          <TileLayer
            url="https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.state.placedMarker ? (
            <Marker ref={this.markerRef} position={this.state.markerPos}>
              <Popup open={true}>
                <b>{this.state.info}</b>
                <br />
                {!this.state.loggedIn ? (
                  <i>
                    Du må <NavLink to={'/login'}>logge inn</NavLink> eller{' '}
                    <NavLink to={'/register'}>registrere deg</NavLink> for å melde inn saker
                  </i>
                ) : null}
                {this.props.modal && this.state.loggedIn ? (
                  <Modal
                    basic
                    trigger={
                      <Container textAlign={'center'}>
                        <Button>Meld hendelse her</Button>
                      </Container>
                    }
                    closeIcon
                  >
                    <TicketFormWidget
                      submit={this.props.submit}
                      latlng={this.state.markerPos}
                      subregion={this.state.subregion}
                      address={this.state.info}
                    />
                  </Modal>
                ) : null}
              </Popup>
            </Marker>
          ) : null}
          {this.state.foundPos ? (
            <Marker ref={this.userMarkerPosRef} position={this.state.userPos} icon={this.greenIcon}>
              <Popup open={true}>
                <b>Din posisjon: {this.state.userInfo}</b>
                <br />
                {this.props.modal && this.state.loggedIn ? (
                  <Modal
                    basic
                    trigger={
                      <Container textAlign={'center'}>
                        <Button>Meld hendelse her</Button>
                      </Container>
                    }
                    closeIcon
                  >
                    <TicketFormWidget
                      submit={this.props.submit}
                      latlng={this.state.userPos}
                      subregion={this.state.subregion}
                      address={this.state.userInfo}
                    />
                  </Modal>
                ) : null}
              </Popup>
            </Marker>
          ) : null}
        </Map>
      </div>
    );
  }

  areaToggler() {
    this.props.areaToggle();
    let self = this;
    let info = '';
    if (this.state.areaToggle && this.state.poly) {
      this.state.map.removeLayer(this.state.poly);
      this.setState({ area: [] });
    }
    if (this.state.placedMarker) {
      this.state.marker.closePopup();
      this.setState({ area: [this.state.markerPos], info: null });
    }
    if (this.state.areaToggle && this.state.placedMarker) {
      this.state.reverseSearch.latlng(this.state.marker.getLatLng()).run(function(error, result) {
        if (result.address.Address) {
          info = result.address.Address + ', ' + result.address.Subregion;
          self.props.callbackPoint(self.state.marker.getLatLng(), info);
          self.setState({ reverseSearchRes: result, info: info, subregion: result.address.Subregion });
        } else {
          info = result.address.Match_addr + ', ' + result.address.Subregion;
          self.props.callbackPoint(self.state.marker.getLatLng(), info);
          self.setState({
            reverseSearchRes: result,
            info: info
          });
        }
        self.state.marker.openPopup();
      });
    }
    this.setState({ areaToggle: !this.state.areaToggle });
  }

  clear() {
    this.state.map.removeLayer(this.state.poly);
    this.state.map.removeLayer(this.state.marker);
    this.state.map.flyTo([this.state.lat, this.state.lng], 14);
    this.setState({ placedMarker: false, area: [] });
    this.props.callbackArea([], '');
    this.props.placedMarker(false);
  }

  removeMarker() {
    this.state.map.removeLayer(this.state.marker);
    this.state.map.flyTo([this.state.lat, this.state.lng], 14);
    this.setState({ marker: null, placedMarker: false });
    this.props.callbackPoint([], '');
    this.props.placedMarker(false);
  }

  undoArea() {
    this.state.area.pop();
    //this.state.map.setView(this.state.area[this.state.area.length - 1]);
    if (this.state.poly) this.state.map.removeLayer(this.state.poly);
    if (this.state.area.length > 0) {
      this.state.marker.setLatLng(this.state.area[this.state.area.length - 1]);
      this.state.map.flyTo(this.state.area[this.state.area.length - 1]);
      this.state.poly = L.polygon(this.state.area).addTo(this.state.map);
      this.calculateArea();
    }
    if (this.state.area.length === 0) {
      this.setState({ placedMarker: false });
      this.props.placedMarker(false);
      this.props.callbackArea([], '');
      //this.state.map.removeLayer(this.state.marker);
    }
  }

  calculateArea() {
    let self = this;
    let info = '';
    let lat = 0;
    let lng = 0;
    for (let i = 0; i < this.state.area.length; i++) {
      lat += this.state.area[i].lat;
      lng += this.state.area[i].lng;
    }
    lat = lat / this.state.area.length;
    lng = lng / this.state.area.length;
    info = this.state.reverseSearch.latlng([lat, lng]).run(function(error, result) {
      if (result.address.Address) {
        info = result.address.Address + ', ' + result.address.Subregion;
        self.props.callbackArea(self.state.area, info);
        self.setState({ info: info, subregion: result.address.Subregion });
      } else {
        info = result.address.Match_addr + ', ' + result.address.Subregion;
        self.props.callbackArea(self.state.area, info);
        self.setState({ info: info, subregion: result.address.Subregion });
      }
    });
  }

  handleClick = e => {
    let self = this;
    let info = '';
    if (this.props.homepage) {
      toast.dismiss();
    }
    this.state.reverseSearch.latlng(e.latlng).run(function(error, result) {
      if (result.address.CountryCode === 'NOR') {
        if (self.state.areaToggle) {
          self.state.area.push(e.latlng);
          self.state.map.flyTo(e.latlng);
          if (self.state.poly) self.state.map.removeLayer(self.state.poly);
          self.state.poly = L.polygon(self.state.area).addTo(self.state.map);
          self.calculateArea();
        } else {
          if (result.address.Address) {
            info = result.address.Address + ', ' + result.address.Subregion;
            self.setState({ reverseSearchRes: result, info: info, subregion: result.address.Subregion });
          } else {
            info = result.address.Match_addr + ', ' + result.address.Subregion;
            self.setState({ reverseSearchRes: result, info: info, subregion: result.address.Subregion });
          }
          //self.state.marker.openPopup();
          if (self.props.callbackPoint) {
            self.props.callbackPoint(e.latlng, info);
          }
          if (self.props.ticket) self.props.callback(e.latlng, info, result.address.Subregion);
        }
        self.state.map.flyTo(e.latlng, 18);
        if (self.props.placedMarker) self.props.placedMarker(true);
        self.setState({ markerPos: e.latlng, placedMarker: true });
        setTimeout(() => {
          self.setState({ marker: self.markerRef.current.leafletElement });
          self.state.marker.openPopup();
        }, 10);
      } else {
        toast.error('Valgt posisjon er ikke i Norge');
      }
    });
  };
}

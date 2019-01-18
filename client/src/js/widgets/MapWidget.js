import React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import L from 'leaflet';
import * as ELG from 'esri-leaflet-geocoder';
import 'esri-leaflet';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import {Button, Icon, Modal} from 'semantic-ui-react';
import {TicketFormWidget} from '../widgets/TicketFormWidget';
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
      loggedIn: (Consumer._currentValue.user ? true : false)
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

  componentWillMount() {}

  componentDidMount() {
    let reverseSearch = new ELG.ReverseGeocode();
    let map = this.mapRef.current.leafletElement;
    let self = this;

    map
      .locate({ setView: true, maxZoom: 15 })
      .on('locationfound', function(e) {
        console.log(e);
        reverseSearch.latlng(e.latlng).run(function(error, result) {
          self.setState({
            userInfo: result.address.Address + ', ' + result.address.Subregion,
            userPos: [e.latitude, e.longitude],
            foundPos: true
          });
          if(self.props.callback){
            self.props.callback(e.latlng, result.address.Address + ', ' + result.address.Subregion);
          }
        });
      })
      .on('locationerror', function(e) {
        self.setState({ foundPos: false });
      });

    let arcgisOnline = new ELG.ArcgisOnlineProvider({ countries: ['NO'] });
    const searchControl = new ELG.Geosearch({
      providers: [arcgisOnline],
      allowMultipleResults: false,
      useMapBounds: false,
      collapseAfterResult: false,
      expanded: true,
      placeholder: 'Søk etter steder eller adresser',
    }).addTo(map);
    searchControl.on('results', function(data) {
      console.log(data.results.length);
      if (data.results.length < 1) {
        toast.warn('Ingen lokasjon funnet');
      }
      else {
        self.handleClick(data.results[0]);
      }
    });
    //console.log(this.userMarkerPosRef.current);
    //if(this.state.foundPos)this.userMarkerPosRef.current.leafletElement.openPopup();
    this.setState({map: map, reverseSearch: reverseSearch});
    /*setTimeout(() => {
        console.log(this.markerRef.current.leafletElement);
        this.userMarkerPosRef.current.leafletElement.openPopup();
        this.setState({marker: this.markerRef.current.leafletElement});
    }, 100);*/
  }

  render() {
    let pos = [this.state.lat, this.state.lng];
    console.log(this.state.loggedIn);
    return (
      <div>
        {this.props.employee || this.props.admin ? (
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
          minZoom={10}
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
                {(this.props.modal && this.state.loggedIn) ? (
                  <Modal trigger={<Button>Meld hendelse her</Button>}>
                    <TicketFormWidget
                      submit={this.props.submit}
                      latlng={this.state.markerPos}
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
                {(this.props.modal && this.props.loggedIn) ? (
                  <Modal trigger={<Button>Meld hendelse her</Button>}>
                    <TicketFormWidget
                      submit={this.props.submit}
                      latlng={this.state.userPos}
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
    let self = this;
    if (this.state.areaToggle && this.state.poly) {
      this.state.map.removeLayer(this.state.poly);
      this.setState({ area: [] });
    }
    if (this.state.placedMarker) {
      this.state.marker.closePopup();
      this.setState({area: [this.state.markerPos], info: null});
    }
    if (this.state.areaToggle && this.state.placedMarker) {
      this.state.reverseSearch.latlng(this.state.marker.getLatLng()).run(function(error, result) {
        if (result.address.Address) {
          self.setState({ reverseSearchRes: result, info: result.address.Address + ', ' + result.address.Subregion });
        } else {
          self.setState({
            reverseSearchRes: result,
            info: result.address.Match_addr + ', ' + result.address.Subregion
          });
        }
        self.state.marker.openPopup();
      });
    }
    console.log(this.state.placedMarker);
    console.log(this.state.areaToggle);
    this.setState({ areaToggle: !this.state.areaToggle });
  }

  clear() {
    this.state.map.removeLayer(this.state.poly);
    this.state.map.removeLayer(this.state.marker);
    this.state.map.flyTo([this.state.lat, this.state.lng], 14);
    this.setState({ placedMarker: false, area: [] });
  }

  removeMarker() {
    this.state.map.removeLayer(this.state.marker);
    this.state.map.flyTo([this.state.lat, this.state.lng], 14);
    this.setState({ marker: null, placedMarker: false });
  }

  undoArea() {
    this.state.area.pop();
    //this.state.map.setView(this.state.area[this.state.area.length - 1]);
    if (this.state.poly) this.state.map.removeLayer(this.state.poly);
    if (this.state.area.length > 0) {
      this.state.marker.setLatLng(this.state.area[this.state.area.length - 1]);
      this.state.map.flyTo(this.state.area[this.state.area.length - 1]);
      this.state.poly = L.polygon(this.state.area).addTo(this.state.map);
    }
    if (this.state.area.length === 0) {
      this.setState({ placedMarker: false });
      //this.state.map.removeLayer(this.state.marker);
    }
  }

  handleClick = e => {
    let self = this;
    let info = '';
    console.log(e.latlng);

    if (this.state.areaToggle) {
      this.state.area.push(e.latlng);
      this.state.map.flyTo(e.latlng);
      if (this.state.poly) this.state.map.removeLayer(this.state.poly);
      this.state.poly = L.polygon(this.state.area).addTo(this.state.map);
    } else {
      this.state.reverseSearch.latlng(e.latlng).run(function (error, result) {
        if(result.address.Address){
          info = result.address.Address + ', ' + result.address.Subregion;
          self.setState({reverseSearchRes: result, info: info});
        }else{
          info = result.address.Match_addr + ', ' + result.address.Subregion;
          self.setState({reverseSearchRes: result, info: info});
        }
        self.state.marker.openPopup();
        console.log(info);
        if(self.props.callback){
          self.props.callback(e.latlng, info);
        }
      });
      this.state.map.flyTo(e.latlng, 18);
    }
    this.setState({markerPos: e.latlng, placedMarker: true});
    setTimeout(() => {
      this.setState({marker: this.markerRef.current.leafletElement});
    }, 10);
  };
}
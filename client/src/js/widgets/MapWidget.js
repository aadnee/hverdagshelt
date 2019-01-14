import React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import L from 'leaflet';
import * as ELG from 'esri-leaflet-geocoder';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import {Button, Icon, Modal} from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';

//import {} from './';

export class MapWidget extends Component {
  constructor() {
    super();
    this.state = {
      lat: 63.43,
      lng: 10.38,
      zoom: 13,
      placedMarker: false,
      markerPos: [null, null],
      map: null,
      marker: null,
      area: [],
      counter: 0,
      poly: null,
      areaToggle: false,
      info: null,
      reverseSearch: null,
      reverseSearchRes: null
    };
    this.mapRef = React.createRef();
    this.markerRef = React.createRef();
  }

  componentDidMount() {
    this.setState({map: this.mapRef.current.leafletElement, reverseSearch: new ELG.ReverseGeocode()});
    /*const searchControl = new ELG.Geosearch().addTo(this.state.map);
    const results = new L.LayerGroup().addTo(map);

    searchControl.on('results', function (data) {
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
      }
    });*/
    //const reverseSearch = new ELG.ReverseGeocode();
    //if(this.state.placedMarker)this.setState({marker: this.markerRef.current.leafletElement});
  }


  render() {
    let pos = [this.state.lat, this.state.lng];
    return (
        <div>
          {!this.props.employee ? (<>
            <Button.Group>
              <Button toggle active={!this.state.areaToggle} onClick={() => this.areaToggler()}>Punkt</Button>
              <Button.Or text='&harr;'/>
              <Button toggle active={this.state.areaToggle}
                      onClick={() => this.areaToggler()}>Område</Button>
            </Button.Group>
              {this.state.areaToggle ? (
                  <>
                    <Button disabled={!this.state.area.length > 0} icon onClick={() => this.undo()}><Icon
                        name='undo'></Icon></Button>
                    <Button disabled={!this.state.area.length > 0} onClick={() => this.clear()}>Fjern valgt
                      område</Button>
                  </>)
                  : null}
          </>) : null}
          <Map ref={this.mapRef} center={pos} zoom={this.state.zoom} onClick={this.handleClick} zoomControl={false}
               maxZoom={18} minZoom={10}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                       attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
            {this.state.placedMarker ? (
                <Marker ref={this.markerRef} position={this.state.markerPos}>
                  <Popup open><b>{this.state.info}</b><br/><Modal trigger={<Button>Meld hendelse her</Button>}>
                    <TicketFormWidget/>
                  </Modal></Popup>
                </Marker>) : null}
          </Map>

        </div>
    );
  }

  areaToggler() {
    let self = this;
    if (this.state.areaToggle && this.state.poly) {
      this.state.map.removeLayer(this.state.poly);
      this.setState({area: []});
    }
    if (this.state.placedMarker) {
      this.state.marker.closePopup();
      this.setState({area: [this.state.markerPos], info: null});
    }
    if (this.state.areaToggle && this.state.placedMarker){
      this.state.reverseSearch.latlng(this.state.marker.getLatLng()).run(function (error, result) {
        self.setState({reverseSearchRes: result, info: result.address.Match_addr + ', ' + result.address.Subregion});
        self.state.marker.openPopup();
      });
    }
    console.log(this.state.placedMarker);
    console.log(this.state.areaToggle);
    this.setState({areaToggle: !this.state.areaToggle});
  }

  clear() {
    this.state.map.removeLayer(this.state.poly);
    this.state.map.removeLayer(this.state.marker);
    this.setState({placedMarker: false, area: []});
  }

  undo() {
    this.state.area.pop();
    //this.state.map.setView(this.state.area[this.state.area.length - 1]);
    if (this.state.poly) this.state.map.removeLayer(this.state.poly);
    if (this.state.area.length > 0) {
      this.state.marker.setLatLng(this.state.area[this.state.area.length - 1]);
      this.state.poly = L.polygon(this.state.area).addTo(this.state.map);
    }
    if (this.state.area.length === 0) {
      this.setState({placedMarker: false});
      //this.state.map.removeLayer(this.state.marker);
    }
  }

  handleClick = (e) => {
    let self = this;
    console.log(e.latlng);

    if (this.state.placedMarker) this.setState({marker: this.markerRef.current.leafletElement});
    if (this.state.areaToggle) {
      this.state.area.push(e.latlng);
      if (this.state.poly) this.state.map.removeLayer(this.state.poly);
      this.state.poly = L.polygon(this.state.area).addTo(this.state.map);
    } else {
      this.state.reverseSearch.latlng(e.latlng).run(function (error, result) {
        self.setState({reverseSearchRes: result, info: result.address.Match_addr + ', ' + result.address.Subregion});
        self.state.marker.openPopup();
      });
      this.state.map.flyTo(e.latlng, 18);
    }
    this.setState({markerPos: e.latlng, placedMarker: true});
    setTimeout(() => {
      this.setState({marker: this.markerRef.current.leafletElement})
    }, 10);
  }
}

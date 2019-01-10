import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';

//import {} from './';

export class MapWidget extends Component {
  constructor() {
    super();
    this.state = {
      lat: 63.43,
      lng: 10.38,
      zoom: 13,
      placedMarker: false,
      marker: [null, null]
    }
  }


  render() {
    let pos = [this.state.lat, this.state.lng];
    let info = this.state.placedMarker ? this.state.marker.lat + ', ' + this.state.marker.lng : null;
    let selectedMarker = this.state.placedMarker ? (
        <Marker position={this.state.marker}>
          <Popup><b>Info</b><br/>{info}</Popup>
        </Marker>) : null;
    let map = (<Map center={pos} zoom={this.state.zoom} onClick={this.handleClick} zoomControl={false} maxZoom={18} minZoom={10}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
      {this.state.placedMarker ? selectedMarker : null}
    </Map>);
    //todo: Pan/fly-visuals when choosing coordinates
    //this.state.placedMarker ? map.setView(this.state.marker, 15) : null;
    //map.setView(this.state.placedMarker ? this.state.marker : pos, this.state.placedMarker ? 15 : this.state.zoom);
    //if(this.state.placedMarker){map.setView(this.state.marker, 15)}
    return (
        map
    );
  }

  handleClick = (e) => {
    console.log(e.latlng);
    const marker = e.latlng;
    this.state.placedMarker = true;
    this.setState({marker: marker});
  }
}

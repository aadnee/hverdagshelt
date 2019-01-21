import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import L from 'leaflet';
import * as ELG from 'esri-leaflet-geocoder';
import 'esri-leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { toast } from 'react-toastify';

export class ShowInMapWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.mapRef = React.createRef();
  }

  render() {
    return (
<<<<<<< HEAD
      <Modal trigger={this.props.button} onClose={this.props.callback} closeIcon>
=======
      <Modal trigger={this.props.button} onClose={this.props.callback}>
>>>>>>> 578f0142f32ab232e6ba57b63ca4699dbb209741
        {this.props.renderMap ? (
          <Map ref={this.mapRef} dragging={false} center={this.props.latlng} zoom={14}>
            <TileLayer
              url="https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={this.props.latlng} />
          </Map>
        ) : null}
      </Modal>
    );
  }
}

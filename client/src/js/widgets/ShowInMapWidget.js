import React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import L from 'leaflet';
import * as ELG from 'esri-leaflet-geocoder';
import 'esri-leaflet';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import {Button, Icon, Modal} from 'semantic-ui-react';
import {TicketFormWidget} from '../widgets/TicketFormWidget';
import {toast} from 'react-toastify';

export class ShowInMapWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.mapRef = React.createRef();
  };

  render() {
    return (
        <Modal trigger={this.props.button} onClose={this.props.callback}>
          {this.props.renderMap ? (
          <Map
              ref={this.mapRef}
              dragging={false}
              center={this.props.latlng}
              zoom={14}
          >
            <TileLayer
                url="https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={this.props.latlng}></Marker>
          </Map>) : null}
        </Modal>
    );
  }
}
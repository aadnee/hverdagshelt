import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import L from 'leaflet';
import * as ELG from 'esri-leaflet-geocoder';
import 'esri-leaflet';
import { Map, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
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
    const la = this.props.latlng.reduce((lat, latn) => {
      return [lat[0] + latn[0], lat[1] + latn[1]];
    });

    const cent = [la[0] / this.props.latlng.length, la[1] / this.props.latlng.length];
    if (this.props.mapOnly) {
      return (
        <Map
          ref={this.mapRef}
          dragging={false}
          center={cent}
          zoomControl={false}
          scrollWheelZoom={false}
          zoom={15}
          style={{ height: '200px', width: '200px' }}
        >
          <TileLayer
            url="https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.props.latlng.length > 1 ? (
            <Polygon positions={this.props.latlng} />
          ) : (
            <Marker position={this.props.latlng[0]} />
          )}
        </Map>
      );
    } else {
      return (
        <Modal trigger={this.props.button} onClose={this.props.callback} closeIcon>
          {this.props.renderMap ? (
            <Map
              center={cent}
              ref={this.mapRef}
              dragging={this.props.draggable ? true : false}
              center={[this.props.latlng[0][0], this.props.latlng[0][1]]}
              zoom={14}
            >
              <TileLayer
                url="https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {this.props.latlng.length > 1 ? (
                <Polygon positions={this.props.latlng} />
              ) : (
                <Marker position={this.props.latlng[0]} />
              )}
            </Map>
          ) : null}
        </Modal>
      );
    }
  }
}

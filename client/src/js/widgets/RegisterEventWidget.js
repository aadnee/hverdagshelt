import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Modal,
  Segment,
  TextArea
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { Consumer } from '../context';
import 'react-datepicker/dist/react-datepicker.css';

import { categoryService } from '../services/CategoryServices';

import Cookies from 'js-cookie';
import moment from 'moment';

export class RegisterEventWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address ? this.props.address : '',
      latlng: this.props.latlng ? this.props.latlng : [null, null],
      title: this.props.title ? this.props.title : '',
      description: this.props.description ? this.props.description : '',
      url: this.props.url ? this.props.url : '',
      area: this.props.area ? this.props.area : '',
      tags: [],
      tagOptions: [],
      position: [null, null],
      start: this.props.start ? new Date(this.props.start) : new Date(),
      end: this.props.end ? new Date(this.props.end) : null,
      startFormatted: moment(new Date()).format('YYYY-MM-D HH:mm:ss'),
      endFormatted: this.props.end ? new Date(this.props.end) : null
    };
    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
  }

  close = () => this.setState({ modalOpen: false });

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      console.log(this.props);
      this.setState({ address: this.props.address, latlng: this.props.latlng });
    }
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  setStartDate(date) {
    this.setState({ start: date, startFormatted: moment(date).format('YYYY-MM-D HH:mm:ss') });
  }

  setEndDate(date) {
    this.setState({ end: date, endFormatted: moment(date).format('YYYY-MM-D HH:mm:ss') });
  }

  render() {
    return (
      <Container>
        <Grid verticalAlign="middle">
          <Grid.Column>
            <Form size="large">
              <Segment stacked={!this.props.borderless} basic={this.props.borderless}>
                <Form.Field>
                  <label>Adresse:</label>
                  <Input
                    fluid
                    icon="map"
                    iconPosition="left"
                    placeholder="Velg posisjon på kartet"
                    defaultValue={this.state.address}
                    readOnly
                    onClick={this.props.setupClick ? () => this.props.setupClick(this.state.address) : null}
                  />
                  <label>Hvilket arrangement vil du legge inn?</label>
                  <Input
                    fluid
                    icon="connectdevelop"
                    iconPosition="left"
                    placeholder={'Hva heter arrangementet'}
                    value={this.state.title}
                    onChange={(event, data) => {
                      this.handleInput('title', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Tilleggsinformasjon</label>
                  <TextArea
                    autoHeight
                    placeholder={'Beskrivelse'}
                    value={this.state.description}
                    onChange={(event, data) => {
                      this.handleInput('description', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>URL til arrangement:</label>
                  <Input
                    fluid
                    icon="linkify"
                    iconPosition="left"
                    placeholder="Link"
                    value={this.state.url}
                    onChange={(event, data) => {
                      this.handleInput('url', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Grid.Column>
                    <label>Tagger</label>
                    <Dropdown
                      fluid
                      search
                      selection
                      multiple
                      allowAdditions
                      additionLabel={'Legg til '}
                      options={this.state.tags}
                      placeholder="Legg til tagger"
                      onAddItem={(event, data) => {
                        console.log(data.value);
                        console.log(this.state.tags);
                        this.state.tags.push({ key: data.value, value: data.value, text: data.value });
                      }}
                    />
                  </Grid.Column>
                  <label>Starttidspunkt:</label>
                  <DatePicker
                    selected={this.state.start}
                    timeIntervals={5}
                    timeFormat="HH:mm"
                    dateFormat="dd.MM.yyyy HH:mm"
                    showTimeSelect
                    onChange={this.setStartDate}
                  />
                  <label>Sluttidspunkt</label>
                  <DatePicker
                    selected={this.state.end}
                    minDate={this.state.start}
                    timeIntervals={5}
                    timeFormat="HH:mm"
                    dateFormat="dd.MM.yyyy HH:mm"
                    showTimeSelect
                    onChange={this.setEndDate}
                  />
                </Form.Field>
                {this.props.submit ? (
                  <Button
                    color="blue"
                    fluid
                    size="large"
                    onClick={() => {
                      this.props.submit(
                        this.state.title,
                        this.state.description,
                        this.state.startFormatted,
                        this.state.endFormatted,
                        Cookies.get('municipalId'),
                        this.state.url
                      );
                    }}
                  >
                    Registrer arrangement
                  </Button>
                ) : null}
                {this.props.editEvent ? (
                  <Button
                    color="blue"
                    fluid
                    size="large"
                    onClick={() =>
                      this.props.editEvent(
                        this.state.title,
                        this.state.description,
                        this.state.area,
                        this.state.address,
                        this.state.startFormatted,
                        this.state.endFormatted,
                        Cookies.get('municipalId'),
                        this.state.url
                      )
                    }
                  >
                    Redigere arrangement
                  </Button>
                ) : null}
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export class ModalTicketWidget extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    console.log(this.props.ticket);
  }

  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.close}>
        <TicketFormWidget
          editTicket={this.props.editTicket}
          close={this.props.close}
          ticket={this.props.ticket}
          submitButton={'Lagre endringer'}
        />
      </Modal>
    );
  }
}

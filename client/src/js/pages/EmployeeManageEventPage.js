import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Message, Container, Segment, Divider, Modal, Icon } from 'semantic-ui-react';
import { MessageWidget } from '../widgets/MessageWidget';
import { eventService } from '../services/EventServices';
import { ticketService } from '../services/TicketServices';
import { subscriptionService } from '../services/SubscriptionServices';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { EventCardWidget } from '../widgets/EventCardWidget';
import { EmployeeRegisterEventPage } from './EmployeeRegisterEventPage';
import { RegisterWidget } from '../widgets/RegisterWidget';
import { RegisterEventWidget } from '../widgets/RegisterEventWidget';

export class EmployeeManageEventPage extends React.Component {
  constructor(props) {
    super(props);

    this.deleteEvent = this.deleteEvent.bind(this);
    this.openDeleteMessage = this.openDeleteMessage.bind(this);
    this.openEditModal = this.openEditModal.bind(this);

    this.state = {
      eventList: [],
      deleteEventMessage: false,
      editEventModal: false,
      selectedEvent: ''
    };
  }

  componentWillMount() {
    //Fetch events
    eventService.getFilteredEvents(Cookies.get('municipalId'), 0, 0).then(res => {
      this.setState({ eventList: res.data });
    });
  }

  openDeleteMessage = eventId => {
    this.setState({ deleteEventMessage: true, selectedEvent: eventId });
  };

  openEditModal = eventItem => {
    this.setState({ editEventModal: true, selectedEvent: eventItem });
  };

  editEvent = (title, description, area, address, start, end, municipalId, url) => {
    eventService
      .editEvent(
        this.state.selectedEvent.id,
        title,
        description,
        this.state.selectedEvent.area,
        address,
        start,
        end,
        municipalId,
        url
      )
      .then(res => {
        if (res.success) {
          toast.success(res.message.no);
          this.state.eventList.map((eventItem, index) => {
            if (eventItem.id === this.state.selectedEvent.id) {
              let tempEventList = this.state.eventList;
              tempEventList[index].title = title;
              tempEventList[index].description = description;
              tempEventList[index].address = address;
              tempEventList[index].start = start;
              tempEventList[index].end = end;
              tempEventList[index].url = url;
              this.setState({ eventList: tempEventList, editEventModal: false });
            }
          });
        }
      });
  };

  closeEditModal = () => {
    this.setState({ editEventModal: false });
  };

  deleteEvent = () => {
    eventService.deleteEvent(this.state.selectedEvent.id).then(res => {
      if (res.success) {
        toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT });
        this.state.eventList.map((currentEvent, index) => {
          if (currentEvent.id === this.state.selectedEvent.id) {
            let newEventList = this.state.eventList;
            newEventList.splice(index, 1);
            this.setState({ eventList: newEventList });
          }
        });
      } else {
        toast.error(res.message.no, { position: toast.POSITION.TOP_RIGHT });
      }
    });
  };

  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Behandle event</Header>
        <Segment color="blue" basic>
          {this.state.eventList.length == 0 ? (
            <Message icon success>
              <Icon name="folder open outline" />
              <Message.Content>
                <Message.Header>Tomt!</Message.Header>
                Du har ingen arrangementer å behandling.
              </Message.Content>
            </Message>
          ) : null}
          <Divider hidden />
          <Divider hidden />
          <Grid stackable container columns={3}>
            {this.state.eventList.map((eventItem, keyId) => (
              <EventCardWidget
                header={eventItem.title}
                key={keyId}
                description={eventItem.description}
                deleteEvent={this.openDeleteMessage.bind(this, eventItem)}
                editEvent={this.openEditModal.bind(this, eventItem)}
                latlng={eventItem.area}
              />
            ))}
          </Grid>
        </Segment>
        <MessageWidget
          size={'tiny'}
          open={this.state.deleteEventMessage}
          title={'Slette event'}
          message={'Vil du slette denne eventen?'}
          customFunc={this.deleteEvent}
          callback={() => this.setState({ deleteEventMessage: false })}
        />
        <Modal open={this.state.editEventModal} onClose={this.closeEditModal} closeIcon>
          <RegisterEventWidget
            address={this.state.selectedEvent.address}
            area={this.state.selectedEvent.area}
            description={this.state.selectedEvent.description}
            end={this.state.selectedEvent.end}
            start={this.state.selectedEvent.start}
            title={this.state.selectedEvent.title}
            url={this.state.selectedEvent.url}
            editEvent={this.editEvent}
          />
        </Modal>
      </Container>
    );
  }
}

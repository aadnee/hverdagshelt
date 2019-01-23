import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Message, Container, Segment, Divider } from 'semantic-ui-react';
import { MessageWidget } from '../widgets/MessageWidget';
import { eventService } from '../services/EventServices';
import { ticketService } from '../services/TicketServices';
import { subscriptionService } from '../services/SubscriptionServices';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { EventCardWidget } from '../widgets/EventCardWidget';

export class EmployeeManageEventPage extends React.Component {
  constructor(props) {
    super(props);

    this.deleteEvent = this.deleteEvent.bind(this);
    this.openDeleteMessage = this.openDeleteMessage.bind(this);

    this.state = {
      eventList: [],
      deleteEventMessage: false,
      selectedEvent: ''
    };
  }

  componentWillMount() {
    //Fetch events
    eventService.getFilteredEvents(Cookies.get('municipalId'), 0, 0).then(res => {
      console.log(res.data);
      this.setState({ eventList: res.data });
    });
  }

  openDeleteMessage = eventId => {
    this.setState({ deleteEventMessage: true, selectedEvent: eventId });
  };

  deleteEvent = () => {
    eventService.deleteEvent(this.state.selectedEvent).then(res => {
      if (res.success) {
        toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT });
        this.state.eventList.map((currentEvent, index) => {
          if (currentEvent.id === this.state.selectedEvent) {
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
          <Divider hidden />
          <Divider hidden />
          <Grid stackable container columns={3}>
            {this.state.eventList.map((eventItem, keyId) => (
              <EventCardWidget
                header={eventItem.title}
                key={keyId}
                description={eventItem.description}
                deleteEvent={this.openDeleteMessage.bind(this, eventItem.id)}
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
      </Container>
    );
  }
}

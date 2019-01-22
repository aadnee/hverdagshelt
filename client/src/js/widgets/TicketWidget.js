import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, Image, Icon, Button, Header, Placeholder, Label, Modal, Dropdown } from 'semantic-ui-react';
import { Consumer } from './../context';
import { PENDING, DONE, REJECTED, STATUS } from '../commons';

import { PublishNewsFormWidget } from './PublishNewsFormWidget';
import { newsService } from '../services/NewsServices';
import { categoryService } from '../services/CategoryServices';
import Cookies from 'js-cookie';
import { ticketService } from '../services/TicketServices';

/*
const options = [
  { key: 'reject', icon: 'delete', text: 'Avslå', value: 'reject' },
  { key: 'publish', icon: 'newspaper', text: 'Publiser som nyhet', value: 'publish' },
  { key: 'company', icon: 'warehouse', text: 'Knytt til bedrift', value: 'company' },
  { key: 'user', icon: 'user', text: 'Knytt til bruker', value: 'user' }
];*/

export class TicketWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedNews: '',
      dropdownOpen: false,
      newsOptions: [],
      ticket: this.props.ticket,
      createdAt: this.props.ticket.createdAt
    };
  }

  close = () => this.setState({ open: false });

  handleInput(state, value) {
    this.setState({ [state]: value });
  }

  componentWillMount() {
    let catIds = [];
    let dropdownOptions = [];
    categoryService
      .getCategories()
      .then(res => {
        res.data.map(c => {
          catIds.push(c.id);
        });
      })
      .then(() => {
        //change Cookies.get('municipalId) with Consumer._currentValue.user.municipalId
        //didnt work for me

        newsService.getFilteredNews(Cookies.get('municipalId'), catIds, 0, 0).then(res => {
          res.data.map(news => {
            dropdownOptions.push({ key: news.id, value: news.id, text: news.title });
          });
          this.setState({ newsOptions: dropdownOptions });
          //console.log(dropdownOptions);
        });
      });
  }

  link() {
    console.log('link');
    this.setState({ open: false });
    this.props.link(this.state.selectedNews);
  }

  render() {
    return (
      <Card centered>
        <Image>
          <Image src="img/thumbnaildiv.png" />
          {this.state.ticket.status === PENDING && !this.props.employee ? (
            <Label color="yellow" ribbon="right">
              {STATUS[PENDING - 1].norwegian}
            </Label>
          ) : null}
          {this.state.ticket.status === DONE && !this.props.employee ? (
            <Label color="green" ribbon="right">
              {STATUS[DONE - 1].norwegian}
            </Label>
          ) : null}
          {this.state.ticket.status === REJECTED && !this.props.employee ? (
            <Label color="red" ribbon="right">
              {STATUS[REJECTED - 1].norwegian}
            </Label>
          ) : null}
        </Image>
        <Card.Content>
          <Header>
            <Header.Content>
              {this.state.ticket.title}
              <Header.Subheader>{this.state.ticket.category}</Header.Subheader>
              {this.state.ticket.subCategory ? (
                <Header.Subheader>{this.state.ticket.subCategory}</Header.Subheader>
              ) : null}
            </Header.Content>
          </Header>
          <Card.Meta>{Consumer._currentValue.convDbString(this.state.createdAt)}</Card.Meta>
          <Card.Description>{this.state.ticket.description}</Card.Description>
        </Card.Content>
        {this.props.employee ? (
          this.state.ticket.status === PENDING ? (
            <Card.Content extra>
              <Dropdown text={'Behandle'} simple>
                <Dropdown.Menu>
                  {/*REGISRER SOM NYHET*/}
                  <Modal trigger={<Dropdown.Item icon={'newspaper'} text={'Publiser som nyhet'} />}>
                    <Modal.Header>Registrer varselen som nyhet</Modal.Header>
                    <Modal.Content>
                      <Modal.Description>
                        <PublishNewsFormWidget
                          ticket={this.props.ticket}
                          accept={this.props.accept}
                          submitButton={'Publiser'}
                        />
                      </Modal.Description>
                    </Modal.Content>
                  </Modal>

                  <Dropdown.Item icon={'delete'} text={'Avslå'} onClick={this.props.show} />

                  <Modal
                    open={this.state.open}
                    onOpen={() => this.setState({ open: true })}
                    onClose={() => this.setState({ open: false })}
                    trigger={<Dropdown.Item icon={'linkify'} text={'Knytt til samme nyhet'} />}
                    size={'tiny'}
                    closeIcon
                  >
                    <Modal.Header>Knytt til samme nyhet</Modal.Header>
                    <Modal.Content>
                      <Dropdown
                        fluid
                        search
                        placeholder={'Søk etter Nyhet på tittel'}
                        options={this.state.newsOptions}
                        value={this.state.selectedNews}
                        onChange={(target, data) => {
                          this.handleInput('selectedNews', data.value);
                        }}
                      />
                    </Modal.Content>
                    <Modal.Actions>
                      <Button color={'green'} onClick={() => this.link()}>
                        Lagre
                      </Button>
                      <Button onClick={this.close}>Avbryt</Button>
                    </Modal.Actions>
                  </Modal>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Content>
          ) : null
        ) : this.state.ticket.status === DONE ? (
          <Card.Content extra>
            <Button.Group fluid size="small">
              <Button inverted primary>
                Gå til nyheten
              </Button>
            </Button.Group>
          </Card.Content>
        ) : this.state.ticket.status === PENDING ? (
          <Card.Content extra>
            <Button.Group fluid size="small">
              <Button inverted primary onClick={() => this.props.show('showEditTicket', this.state.ticket, null)}>
                Endre
              </Button>
              <Button inverted secondary onClick={() => this.props.show('messageOpen', null, this.state.ticket.id)}>
                Trekk tilbake
              </Button>
            </Button.Group>
          </Card.Content>
        ) : null}
      </Card>
    );
  }
}

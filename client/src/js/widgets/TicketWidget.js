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
import { NewsCaseWidget } from './NewsCaseWidget';

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
      letters: 100,
      regModalOpen: false,
      newsModalOpen: false,
      selectedNews: '',
      dropdownOpen: false,

      ticket: this.props.ticket,
      createdAt: this.props.ticket.createdAt,
      newsOptions: [],
      news: [],
      newsCase: null
    };
  }

  close = () => this.setState({ open: false });
  closeRegModal = () => this.setState({ regModalOpen: false });

  handleInput(state, value) {
    this.setState({ [state]: value });
  }

  componentWillMount() {
    if (this.props.news) {
      this.setState({ news: this.props.news, newsOptions: this.props.newsOptions, newsCase: this.props.newscase });
    }
  }

  link() {
    this.setState({ open: false });
    this.props.link(this.state.selectedNews);
  }

  showNews() {}

  render() {
    let more = false;
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
          <Card.Description>
            {this.state.ticket.description
              .split('')
              .map((letter, i) => (i < this.state.letters ? letter : (more = true)))}
            {more ? (
              <>
                ...{' '}
                <span
                  className="showInMap"
                  onClick={() => {
                    this.setState({ letters: Number.MAX_SAFE_INTEGER });
                  }}
                >
                  Vis mer
                </span>{' '}
              </>
            ) : this.state.letters === Number.MAX_SAFE_INTEGER ? (
              <>
                {'\n'}
                <span
                  className="showInMap"
                  onClick={() => {
                    this.setState({ letters: 100 });
                  }}
                >
                  Vis mindre
                </span>{' '}
              </>
            ) : null}
          </Card.Description>
        </Card.Content>
        {this.props.employee ? (
          this.state.ticket.status === PENDING ? (
            <Card.Content extra>
              <Dropdown text={'Behandle'} simple>
                <Dropdown.Menu>
                  {/*REGISRER SOM NYHET*/}
                  <Modal
                    open={this.state.regModalOpen}
                    onOpen={() => this.setState({ regModalOpen: true })}
                    onClose={() => this.closeRegModal()}
                    trigger={<Dropdown.Item icon={'newspaper'} text={'Publiser som nyhet'} />}
                    closeIcon
                  >
                    <Modal.Header>Registrer varselen som nyhet</Modal.Header>
                    <Modal.Content>
                      <Modal.Description>
                        <PublishNewsFormWidget
                          ticket={this.props.ticket}
                          accept={this.props.accept}
                          submitButton={'Publiser'}
                          close={this.closeRegModal}
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
                        selection
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
              <Button
                inverted
                primary
                onClick={() => {
                  this.showNews(this.props.ticket.newsId);
                }}
              >
                Vis nyheten
              </Button>
              <Modal
                open={this.state.newsModalOpen}
                onClose={() => this.setState({ newsModalOpen: false })}
                onOpen={() => this.setState({ newsModalOpen: true })}
                closeIcon
              >
                <Modal.Content>
                  <NewsCaseWidget newscase={this.state.newsCase} />
                </Modal.Content>
              </Modal>
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

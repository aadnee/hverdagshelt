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
import { toast } from 'react-toastify';

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

      newsCase: null
    };
  }

  close = () => this.setState({ open: false });
  closeRegModal = () => this.setState({ regModalOpen: false });

  handleInput(state, value) {
    this.setState({ [state]: value });
  }

  componentWillMount() {
    if (this.props.ticket) {
      if (this.props.ticket.newsId) {
        let newsId = this.props.ticket.newsId;
        newsService.getArticle(newsId).then(res => {
          this.setState({ newsCase: res.data });
        });
      }
    }
  }

  link() {
    this.setState({ open: false });
    this.props.link(this.state.selectedNews);
  }

  showNews() {
    this.setState({ newsModalOpen: true });
  }

  accept = (title, description, lat, lon, address, subCategory, publish, mun, image) => {
    if (this.props.accept(title, description, lat, lon, address, subCategory, publish, mun, image)) {
      this.closeRegModal();
    } else {
      toast.error('Vennligst fyll ut alle felt', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  render() {
    let more = false;
    return (
      <Card centered>
        <Image>
          <Image
            src={this.state.ticket.uploads.length > 0 ? '/uploads/' + this.state.ticket.uploads[0].filename : null}
          />
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
              {this.state.ticket.title + this.state.ticket.id}
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
                          accept={this.accept}
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
                    <Modal.Header>Knytt til lik nyhet</Modal.Header>
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
                  this.showNews();
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
                  <NewsCaseWidget newscase={this.state.newsCase} show />
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
        ) : this.state.ticket.status === REJECTED ? (
          <Card.Content extra>
            <p>Melding fra ansatt:</p>
            <p>{this.state.ticket.feedback ? this.state.ticket.feedback : 'Ingen tilbakemelding.'}</p>
          </Card.Content>
        ) : null}
      </Card>
    );
  }
}

import React from 'react';
import { Component } from 'react';
import {
  Divider,
  Segment,
  Container,
  Grid,
  Label,
  Header,
  Image,
  Form,
  Modal,
  Button,
  Dropdown,
  Icon,
  Card
} from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Consumer } from './../context';
import { ShowInMapWidget } from './ShowInMapWidget';
import { PublishNewsFormWidget } from './PublishNewsFormWidget';

import { subscriptionService } from './../services/SubscriptionServices';

import { toast } from 'react-toastify';

import { INPROGRESS, DONE, SOFT_DELETED, STATUS } from '../commons';
import { MessageWidget } from './MessageWidget';
import { companyService } from '../services/CompanyServices';

export class NewsCaseWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderMap: false,
      editModalOpen: false,
      messageModalOpen: false,
      companyModalOpen: false,
      company: '',
      companyOptions: [],
      executedBy: '',
      letters: 100
    };
    this.close = this.close.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  close() {
    this.setState({ renderMap: false });
  }

  closeModal() {
    this.setState({ editModalOpen: false });
  }

  closeMessageModal = () => {
    this.setState({ messageModalOpen: false });
  };

  componentWillMount() {
    if (this.props.companies) {
      this.setState({ companyOptions: this.props.companyOptions });
    }
  }

  editNews = (title, description, category, published) => {
    this.props.editNews(title, description, category, published);
    this.closeModal();
  };

  setStatus() {
    if (this.props.setStatus()) {
      this.setState({ messageModalOpen: false });
    }
  }

  sendToCompany(companyId, companyName) {
    if (!companyId) {
      toast.error('Velg en bedrift');
    } else {
      if (this.props.sendToCompany(companyId, companyName)) {
        this.setState({ companyModalOpen: false });
      }
    }
  }

  followCase = () => {
    subscriptionService.addSubscription(this.props.newscase.id).then(res => {
      if (res.success) {
        this.props.startFollowCallBack(this.props.newscase.id);
        toast.success('Du følger nå saken');
      } else {
        toast.warn('Noe gikk galt, prøv igjen senere');
      }
    });
  };

  render() {
    const newscase = this.props.newscase;
    const dateInfo = Consumer._currentValue.convDbString(newscase.createdAt);
    let more = false;

    return (
      <>
        <Card fluid color="blue">
          <Grid>
            <Grid.Column width={8}>
              <Container style={{ padding: 14 }}>
                <Card.Header as="h3">{newscase.title}</Card.Header>
                <Card.Meta>
                  <Icon name="calendar outline" />
                  {dateInfo}
                  <br />
                  <Icon name="point" />
                  {newscase.address}
                </Card.Meta>
              </Container>
            </Grid.Column>

            <Grid.Column width={8} style={{ width: '100%' }}>
              <Image style={{ width: '100%' }}>
                {this.props.newscase.uploads.length > 0 ? (
                  <Image src={'/uploads/' + this.props.newscase.uploads[0].filename} />
                ) : (
                  <ShowInMapWidget latlng={[[this.props.newscase.lat, this.props.newscase.lon]]} newsMapOnly />
                )}
                {newscase.status === INPROGRESS ? (
                  <Label color="yellow" ribbon="right">
                    {STATUS[INPROGRESS - 1].norwegian}
                  </Label>
                ) : newscase.status === DONE ? (
                  <Label color="green" ribbon="right">
                    {STATUS[DONE - 1].norwegian}
                  </Label>
                ) : null}
              </Image>
            </Grid.Column>
          </Grid>
          <Card.Content style={{ padding: 14, borderTop: 0 }}>
            <Card.Description>
              {newscase.description.split('').map((letter, i) => (i < this.state.letters ? letter : (more = true)))}
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
          <Card.Content extra textAlign="right">
            {this.props.employee ? (
              <Grid.Column floated={'right'} width={2}>
                <Dropdown text={'Behandle'} simple>
                  <Dropdown.Menu>
                    <Modal
                      open={this.state.editModalOpen}
                      closeIcon
                      trigger={<Dropdown.Item color={'teal'}>Endre</Dropdown.Item>}
                      onClose={() => this.closeModal()}
                      onOpen={() => this.setState({ editModalOpen: true })}
                    >
                      <Modal.Header>Behandle Nyhet</Modal.Header>
                      <Modal.Content>
                        <PublishNewsFormWidget
                          submitButton={'Lagre endringer'}
                          news={newscase}
                          close={this.closeModal}
                          editNews={this.editNews}
                        />
                      </Modal.Content>
                    </Modal>
                    <Dropdown.Item onClick={() => this.setState({ messageModalOpen: true })}>Ferdigstill</Dropdown.Item>
                    <Modal
                      size={'tiny'}
                      open={this.state.messageModalOpen}
                      onOpen={() => this.setState({ messageModalOpen: true })}
                      onClose={() => this.setState({ messageModalOpen: false })}
                    >
                      <Modal.Header>Ferdigstilling av nyhet</Modal.Header>
                      <Modal.Content>
                        <p>Er du sikker på at du vil ferdigstille nyheten</p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button negative onClick={() => this.setState({ messageModalOpen: false })}>
                          Nei
                        </Button>
                        <Button
                          positive
                          icon="checkmark"
                          labelPosition="right"
                          content="Ja"
                          onClick={() => this.setStatus()}
                        />
                      </Modal.Actions>
                    </Modal>
                    <Modal
                      open={this.state.companyModalOpen}
                      onOpen={() => this.setState({ companyModalOpen: true })}
                      onClose={() => this.setState({ companyModalOpen: false })}
                      trigger={<Dropdown.Item>Knytt til bedrift</Dropdown.Item>}
                      size={'tiny'}
                      closeIcon
                    >
                      <Modal.Header>Send til bedrift</Modal.Header>
                      <Modal.Content>
                        <Dropdown
                          fluid
                          search
                          selection
                          placeholder={'Søk etter bedrift på navn'}
                          options={this.state.companyOptions}
                          value={this.state.company}
                          onChange={(target, data) => {
                            this.setState({ company: data.value });
                          }}
                        />
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          color={'green'}
                          onClick={() => {
                            console.log(this.state);
                            let compName = this.state.companyOptions.find(c => c.value === this.state.company).text;
                            console.log(compName);
                            this.sendToCompany(this.state.company, compName);
                          }}
                        >
                          Lagre
                        </Button>
                        <Button onClick={() => this.setState({ companyModalOpen: false })}>Avbryt</Button>
                      </Modal.Actions>
                    </Modal>
                  </Dropdown.Menu>
                </Dropdown>
              </Grid.Column>
            ) : this.props.show ? null : this.props.following ? (
              this.props.mynews ? (
                <Button onClick={this.props.show}>Avslutt abonnement</Button>
              ) : null
            ) : Consumer._currentValue.user && !this.props.archive ? (
              <Button onClick={this.followCase}>Følg saken</Button>
            ) : null}
          </Card.Content>
        </Card>
      </>
    );
  }

  /*render() {
    const newscase = this.props.newscase;
    const dateInfo = Consumer._currentValue.convDbString(newscase.createdAt);
    return (
      <Segment color="blue" fluid="true">
        <Container>
          {newscase.status === INPROGRESS ? (
            <Label color="yellow" ribbon>
              {STATUS[INPROGRESS - 1].norwegian}
            </Label>
          ) : newscase.status === DONE ? (
            <Label color="green" ribbon>
              {STATUS[DONE - 1].norwegian}
            </Label>
          ) : null}

          <Header as="h2">{newscase.title}</Header>
          <p>{dateInfo}</p>
          <Divider />
          <Segment vertical>
            <Grid divided inverted stackable>
              <Grid.Column width={12} textAlign="left">
                <p>{newscase.description}</p>
              </Grid.Column>
              {newscase.uploads ? (
                newscase.uploads.length > 0 ? (
                  <Grid.Column width={4} align="right" only="tablet computer">
                    <Image fluid src={'uploads/' + newscase.uploads[0].filename} target="_blank" />
                  </Grid.Column>
                ) : null
              ) : null}
            </Grid>
          </Segment>
          <Segment basic>
            <Grid stackable>
              <Grid.Column width={16}>
                Hendelses-adresse: {newscase.address}
                <ShowInMapWidget
                  callback={this.close}
                  renderMap={this.state.renderMap}
                  button={
                    <span className="showInMap" onClick={() => this.setState({ renderMap: true })}>
                      vis i kart
                    </span>
                  }
                  latlng={[newscase.lat, newscase.lon]}
                />
              </Grid.Column>
              <Grid.Column width={16}>
                {newscase.companyId ? 'Oppdrag utføres av firmaet: ' + this.props.newscase.executedBy : null}
              </Grid.Column>
              {this.props.employee ? (
                <Grid.Column floated={'right'} width={2}>
                  <Dropdown text={'Behandle'} simple>
                    <Dropdown.Menu>
                      <Modal
                        open={this.state.editModalOpen}
                        closeIcon
                        trigger={<Dropdown.Item color={'teal'}>Endre</Dropdown.Item>}
                        onClose={() => this.closeModal()}
                        onOpen={() => this.setState({ editModalOpen: true })}
                      >
                        <Modal.Header>Behandle Nyhet</Modal.Header>
                        <Modal.Content>
                          <PublishNewsFormWidget
                            submitButton={'Lagre endringer'}
                            news={newscase}
                            close={this.closeModal}
                            editNews={this.editNews}
                          />
                        </Modal.Content>
                      </Modal>
                      <Dropdown.Item onClick={() => this.setState({ messageModalOpen: true })}>
                        Ferdigstill
                      </Dropdown.Item>
                      <Modal
                        size={'tiny'}
                        open={this.state.messageModalOpen}
                        onOpen={() => this.setState({ messageModalOpen: true })}
                        onClose={() => this.setState({ messageModalOpen: false })}
                      >
                        <Modal.Header>Ferdigstilling av nyhet</Modal.Header>
                        <Modal.Content>
                          <p>Er du sikker på at du vil ferdigstille nyheten</p>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button negative onClick={() => this.setState({ messageModalOpen: false })}>
                            Nei
                          </Button>
                          <Button
                            positive
                            icon="checkmark"
                            labelPosition="right"
                            content="Ja"
                            onClick={() => this.setStatus()}
                          />
                        </Modal.Actions>
                      </Modal>
                      <Modal
                        open={this.state.companyModalOpen}
                        onOpen={() => this.setState({ companyModalOpen: true })}
                        onClose={() => this.setState({ companyModalOpen: false })}
                        trigger={<Dropdown.Item>Knytt til bedrift</Dropdown.Item>}
                        size={'tiny'}
                        closeIcon
                      >
                        <Modal.Header>Send til bedrift</Modal.Header>
                        <Modal.Content>
                          <Dropdown
                            fluid
                            search
                            selection
                            placeholder={'Søk etter bedrift på navn'}
                            options={this.state.companyOptions}
                            value={this.state.company}
                            onChange={(target, data) => {
                              this.setState({ company: data.value });
                            }}
                          />
                        </Modal.Content>
                        <Modal.Actions>
                          <Button
                            color={'green'}
                            onClick={() => {
                              console.log(this.state);
                              let compName = this.state.companyOptions.find(c => c.value === this.state.company).text;
                              console.log(compName);
                              this.sendToCompany(this.state.company, compName);
                            }}
                          >
                            Lagre
                          </Button>
                          <Button onClick={() => this.setState({ companyModalOpen: false })}>Avbryt</Button>
                        </Modal.Actions>
                      </Modal>
                    </Dropdown.Menu>
                  </Dropdown>
                </Grid.Column>
              ) : this.props.show ? null : this.props.following ? (
                this.props.frontpage ? null : (
                  <Button onClick={this.props.show}>Avslutt abonnement</Button>
                )
              ) : Consumer._currentValue.user && !this.props.archive ? (
                <Button onClick={this.followCase}>Følg saken</Button>
              ) : null}
            </Grid>
          </Segment>
        </Container>
      </Segment>
    );
  }*/
}

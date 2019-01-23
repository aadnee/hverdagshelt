import React from 'react';
import { Component } from 'react';
import { Divider, Segment, Container, Grid, Label, Header, Image, Form, Modal, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Consumer } from './../context';
import { ShowInMapWidget } from './ShowInMapWidget';
import { PublishNewsFormWidget } from './PublishNewsFormWidget';

import { INPROGRESS, DONE, SOFT_DELETED, STATUS } from '../commons';

export class NewsCaseWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderMap: false,
      editModalOpen: false
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

  componentWillMount() {}

  editNews = (title, description, category, status, published, company) => {
    this.props.editNews(title, description, category, status, published, company);

    this.closeModal();
  };

  render() {
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
                    <Image fluid src={'/uploads/' + newscase.uploads[0].filename} target="_blank" />
                  </Grid.Column>
                ) : null
              ) : null}
            </Grid>
          </Segment>
          <Segment basic>
            <Grid stackable>
              <Grid.Column floated={'left'} width={4}>
                Hendelses-adresse: {newscase.address},
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
              {this.props.employee ? (
                <Grid.Column floated={'right'} width={2}>
                  <Button.Group>
                    <Modal
                      open={this.state.editModalOpen}
                      closeIcon
                      trigger={<Button color={'teal'}>Behandle</Button>}
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
                  </Button.Group>
                </Grid.Column>
              ) : (
                <Button size={'large'} onClick={this.props.show}>
                  Avslutt abonnement
                </Button>
              )}
            </Grid>
          </Segment>
        </Container>
      </Segment>
    );
  }
}
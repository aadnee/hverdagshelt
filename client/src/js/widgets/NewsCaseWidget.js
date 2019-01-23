import React from 'react';
import { Component } from 'react';
import { Divider, Segment, Container, Grid, List, Header, Image, Form, Input, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Consumer } from './../context';
import { ShowInMapWidget } from './ShowInMapWidget';

export class NewsCaseWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderMap: false
    };
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ renderMap: false });
  }

  componentWillMount() {
    console.log(this.props.newscase);
  }

  render() {
    const newscase = this.props.newscase;
    const dateInfo = Consumer._currentValue.convDbString(newscase.createdAt);
    return (
      <Segment color="blue" fluid="true">
        <Container>
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
            </Grid>
          </Segment>
          <Button onClick={this.props.show}>Avslutt abonnement</Button>
        </Container>
      </Segment>
    );
  }
}

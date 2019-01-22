import React from 'react';
import { Component } from 'react';
import { Divider, Segment, Container, Grid, List, Header, Image, Form, Input, Button } from 'semantic-ui-react';
import { Consumer } from './../context';
import { ShowInMapWidget } from './ShowInMapWidget';

//import {} from './';

export class AssignmentWidget extends Component {
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

    render() {

        //dette må hentes fra databasen senere
        const newscase = {
            createdAt: "2019-06-06T14:00:00.000Z",
            title: "title",
            description: "description",
            imageURL: "imageURL",
            address: "address",
            company: "company",
            lat: "lat",
            lon: "lon"
        };
        const dateInfo = Consumer._currentValue.convDbString(newscase.createdAt);
        return (
            <Segment color="blue" fluid="true">
                <Container>
                    <Segment vertical>
                        <Grid divided inverted stackable>
                            <Grid.Column width={12} textAlign="left">
                                <Header as="h2">{newscase.title}</Header>
                            </Grid.Column>
                            <Grid.Column width={4} textAlign="right">
                                <p>{dateInfo[0]}</p>
                                <p>
                                    <i>{dateInfo[1]}</i>
                                </p>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment vertical>
                        <Container>
                            <Grid divided inverted stackable>
                                <Grid.Column width={12} textAlign="left">
                                    <p>{newscase.description}</p>
                                </Grid.Column>
                                {newscase.imageURL ? (
                                    <Grid.Column width={4} align="right" only="tablet computer">
                                        <Image fluid src={newscase.imageURL} target="_blank" />
                                    </Grid.Column>
                                ) : null}
                            </Grid>
                        </Container>
                    </Segment>
                    <List link>
                        <List.Item as="a">
                            <List.Content floated={'left'}>
                                Hendelses-adresse: {newscase.address}
                                <ShowInMapWidget
                                    callback={this.close}
                                    renderMap={this.state.renderMap}
                                    button={<Button onClick={() => this.setState({ renderMap: true })}>Vis i kart</Button>}
                                    latlng={[newscase.lat, newscase.lon]}
                                />
                            </List.Content>
                        </List.Item>
                    </List>
                    <Button.Group fluid>
                        <Button color='red'>Avslå oppdrag</Button>
                        <Button.Or text='&harr;'/>
                        <Button positive>Ta oppdrag</Button>
                    </Button.Group>
                </Container>
            </Segment>
        );
    }
}
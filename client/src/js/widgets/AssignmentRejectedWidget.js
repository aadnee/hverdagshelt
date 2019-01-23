import React from 'react';
import { Component } from 'react';
import {Divider, Segment, Container, Grid, List, Header, Image, Form, Input, Button, Dropdown} from 'semantic-ui-react';
import { Consumer } from './../context';
import { ShowInMapWidget } from './ShowInMapWidget';
import {Modal} from "semantic-ui-react/dist/commonjs/modules/Modal/Modal";
import {PublishNewsFormWidget} from "./PublishNewsFormWidget";

export class AssignmentRejectedWidgetWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderMap: false
        };
        this.close = this.close.bind(this);
    }

    close() {
        this.setState({renderMap: false});
    }

    render() {
        //dette må hentes fra databasen senere
        const assignment = {
            createdAt: "2019-06-06T14:00:00.000Z",
            title: "title",
            description: "description",
            imageURL: "imageURL",
            address: "address",
            company: "company",
            lat: "lat",
            lon: "lon",
            status: ""
        };
        const dateInfo = Consumer._currentValue.convDbString(assignment.createdAt);
        return (
            <Segment color="blue" fluid="true">
                <Container>
                    <Segment vertical>
                        <Header as="h2">{assignment.title}</Header>
                        <p>{dateInfo}</p>
                    </Segment>
                    <Segment vertical>
                        <Container>
                            <Grid divided inverted stackable>
                                <Grid.Column width={12} textAlign="left">
                                    <p>{assignment.description}</p>
                                </Grid.Column>
                                {assignment.uploads ? (
                                    assignment.uploads.length > 0 ? (
                                        <Grid.Column width={4} align="right" only="tablet computer">
                                            <Image fluid src={'/uploads/' + assignment.uploads[0].filename} target="_blank" />
                                        </Grid.Column>
                                    ) : null
                                ) : null}
                            </Grid>
                        </Container>
                    </Segment>
                    <List link>
                        <List.Item as="a">
                            <List.Content floated={'left'}>
                                Hendelses-adresse: {assignment.address},
                                <ShowInMapWidget
                                    callback={this.close}
                                    renderMap={this.state.renderMap}
                                    button={
                                        <span className="showInMap" onClick={() => this.setState({renderMap: true})}>
                                        vis i kart
                                        </span>
                                    }
                                    latlng={[assignment.lat, assignment.lon]}
                                />
                            </List.Content>
                        </List.Item>
                    </List>
                </Container>
            </Segment>
        );
    }
}